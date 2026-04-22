import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveApiRootUrl } from './api.config.js';

test('resolveApiRootUrl usa mesma origem quando a API é relativa', () => {
  const root = resolveApiRootUrl({
    hostname: 'localhost',
    isProduction: true,
    explicitApiUrl: '/api',
    explicitBackendRoot: 'https://prescrimed.up.railway.app',
  });

  assert.equal(root, '');
});

test('resolveApiRootUrl usa backend root explícito em produção quando a API não é relativa', () => {
  const root = resolveApiRootUrl({
    hostname: 'prescrimed.com.br',
    isProduction: true,
    explicitApiUrl: 'https://api.prescrimed.com.br/api',
    explicitBackendRoot: 'https://api.prescrimed.com.br',
  });

  assert.equal(root, 'https://api.prescrimed.com.br');
});