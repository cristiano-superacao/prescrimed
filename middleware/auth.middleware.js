import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Middleware para verificar token JWT
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco
    const usuario = await Usuario.findById(decoded.userId).select('+senha');
    
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se o usuário está ativo
    if (usuario.status !== 'ativo') {
      return res.status(403).json({ error: 'Usuário inativo' });
    }

    // Adicionar dados do usuário ao request
    req.user = {
      id: usuario._id.toString(),
      empresaId: usuario.empresaId.toString(),
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
      permissoes: usuario.permissoes || [],
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    console.error('Erro na autenticação:', error);
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
};

// Middleware para verificar se é administrador
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Middleware para verificar se é super administrador
export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas Super Administradores.' });
  }
  next();
};

// Middleware para verificar permissões específicas
export const hasPermission = (modulo) => {
  return (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      // Admin e SuperAdmin tem acesso a tudo
      return next();
    }

    if (!req.user.permissoes || !req.user.permissoes.includes(modulo)) {
      return res.status(403).json({ 
        error: `Acesso negado. Você não tem permissão para acessar o módulo: ${modulo}` 
      });
    }

    next();
  };
};

// Middleware para verificar se o recurso pertence à empresa do usuário
export const checkEmpresaOwnership = async (req, res, next) => {
  try {
    const { empresaId } = req.user;
    const resourceEmpresaId = req.params.empresaId || req.body.empresaId;

    if (resourceEmpresaId && resourceEmpresaId !== empresaId) {
      return res.status(403).json({ 
        error: 'Acesso negado. Recurso não pertence à sua empresa.' 
      });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar propriedade da empresa:', error);
    res.status(500).json({ error: 'Erro ao verificar permissões' });
  }
};

export default { authenticate, isAdmin, hasPermission, checkEmpresaOwnership };