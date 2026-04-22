import jwt from 'jsonwebtoken';
import { Usuario, Empresa } from '../models/index.js';

// URL e anon key do Supabase para validação de tokens (sem prefixo VITE_ no backend)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Valida um Supabase access_token chamando a API de autenticação do Supabase.
 * Retorna o objeto do usuário Supabase ou null se o token for inválido.
 */
const getSupabaseUser = async (token) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

/**
 * Verifica restrições de empresa (inativa / trial vencido).
 * Retorna um objeto de erro ou null se não houver bloqueio.
 */
const checkEmpresaBlock = (usuario) => {
  if (usuario.role === 'superadmin') return null;
  const empresa = usuario.empresa;
  if (!empresa || empresa.ativo === false) {
    return {
      status: 403,
      code: 'empresa_inativa',
      error: 'Empresa bloqueada ou inativa. Entre em contato com o suporte.',
    };
  }
  if (empresa.emTeste && empresa.testeFim) {
    const fim = new Date(empresa.testeFim);
    if (!Number.isNaN(fim.getTime()) && new Date() > fim) {
      return {
        status: 403,
        code: 'trial_expired',
        error: 'Período de teste vencido. Entre em contato com o administrador para prorrogar ou ativar um plano.',
        details: { testeFim: empresa.testeFim },
      };
    }
  }
  return null;
};

// Middleware de autenticação — aceita Supabase JWT (primário) ou JWT customizado (fallback)
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    let usuario = null;

    // 1. Tenta validar como Supabase access_token
    const supabaseUser = await getSupabaseUser(token);
    if (supabaseUser?.email) {
      usuario = await Usuario.findOne({
        where: { email: supabaseUser.email },
        include: [{ model: Empresa, as: 'empresa' }],
        attributes: { exclude: ['senha'] },
      });
    }

    // 2. Fallback: valida como JWT customizado (sessões antigas / tokens legados)
    if (!usuario) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        usuario = await Usuario.findByPk(decoded.id, {
          include: [{ model: Empresa, as: 'empresa' }],
          attributes: { exclude: ['senha'] },
        });
      } catch {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
      }
    }

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: 'Usuário inválido ou inativo' });
    }

    const empresaBlock = checkEmpresaBlock(usuario);
    if (empresaBlock) {
      return res.status(empresaBlock.status).json({
        error: empresaBlock.error,
        code: empresaBlock.code,
        details: empresaBlock.details,
      });
    }

    req.user = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      permissoes: usuario.permissoes || [],
      empresaId: usuario.empresaId,
      empresa: usuario.empresa,
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Middleware de isolamento multi-tenant - garante que cada empresa só acesse seus dados
export const tenantIsolation = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  // SuperAdmin pode acessar todas as empresas
  if (req.user.role === 'superadmin') {
    // Opcional: permitir que o superadmin selecione um contexto de empresa
    // sem perder a capacidade de acessar tudo quando não informado.
    const headerEmpresaId = req.headers['x-empresa-id'];
    const contextEmpresaId = req.query?.empresaId || headerEmpresaId;

    if (contextEmpresaId) {
      if (req.method === 'GET') {
        req.query.empresaId = contextEmpresaId;
      }

      if (req.method === 'POST' || req.method === 'PUT') {
        if (!req.body?.empresaId) {
          req.body.empresaId = contextEmpresaId;
        }
      }

      req.tenantEmpresaId = contextEmpresaId;
    }

    return next();
  }

  // Para outros usuários, força o filtro por empresaId
  const empresaId = req.user.empresaId;
  
  // Aplica empresaId em query params (GET)
  if (req.method === 'GET') {
    req.query.empresaId = empresaId;
  }
  
  // Aplica empresaId no body (POST, PUT)
  if (req.method === 'POST' || req.method === 'PUT') {
    req.body.empresaId = empresaId;
  }
  
  // Para rotas de atualização/deleção, verifica se o recurso pertence à empresa
  req.tenantEmpresaId = empresaId;
  
  next();
};

// Middleware para verificar se o usuário tem permissão de acesso ao recurso
export const checkResourceOwnership = (model) => {
  return async (req, res, next) => {
    try {
      // SuperAdmin sempre tem acesso
      if (req.user.role === 'superadmin') {
        return next();
      }

      const resourceId = req.params.id;
      if (!resourceId) {
        return next();
      }

      // Buscar o recurso
      const resource = await model.findByPk(resourceId);
      
      if (!resource) {
        return res.status(404).json({ error: 'Recurso não encontrado' });
      }

      // Verificar se pertence à empresa do usuário
      if (resource.empresaId !== req.user.empresaId) {
        return res.status(403).json({ 
          error: 'Acesso negado: você não tem permissão para acessar este recurso' 
        });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar propriedade do recurso:', error);
      return res.status(500).json({ error: 'Erro ao verificar permissões' });
    }
  };
};

// Middleware para verificar roles específicas
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado: você não tem permissão para esta ação' 
      });
    }

    next();
  };
};
