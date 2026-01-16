import express from 'express';
import bcrypt from 'bcryptjs';
import { Usuario, Empresa } from '../models/index.js';

const router = express.Router();

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = empresaId ? { empresaId } : {};
    
    const usuarios = await Usuario.findAll({
      where,
      attributes: { exclude: ['senha'] },
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }]
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] },
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }]
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Criar novo usuário
router.post('/', async (req, res) => {
  try {
    const { senha, ...dados } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const usuario = await Usuario.create({
      ...dados,
      senha: senhaHash
    });
    
    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;
    
    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const { senha, ...dados } = req.body;
    const dadosAtualizados = { ...dados };
    
    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }
    
    await usuario.update(dadosAtualizados);
    
    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;
    
    res.json(usuarioSemSenha);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await usuario.destroy();
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;
