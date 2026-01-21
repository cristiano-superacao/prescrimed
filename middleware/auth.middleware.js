import jwt from 'jsonwebtoken';
import { Usuario, Empresa } from '../models/index.js';

// Middleware de autenticação - verifica se o token JWT é válido
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário completo do banco
    const usuario = await Usuario.findByPk(decoded.id, {
      include: [{ model: Empresa, as: 'empresa' }],
      attributes: { exclude: ['senha'] }
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: 'Usuário inválido ou inativo' });
    }

    // Anexar informações do usuário à requisição
    req.user = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      permissoes: usuario.permissoes || [],
      empresaId: usuario.empresaId,
      empresa: usuario.empresa
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
