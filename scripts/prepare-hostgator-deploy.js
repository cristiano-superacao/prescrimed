import { spawn } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const localEnvPath = path.join(rootDir, '.env.hostgator.production.local');
const clientDistPath = path.join(rootDir, 'client', 'dist');
const templateDirPath = path.join(rootDir, 'Template');
const artifactsDirPath = path.join(rootDir, 'hostgator-artifacts');

const requiredEnvKeys = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'FRONTEND_URL',
  'ALLOWED_ORIGINS',
  'PUBLIC_BASE_URL',
  'HOSTGATOR_EMPRESA_NOME',
  'HOSTGATOR_EMPRESA_TIPO',
  'HOSTGATOR_EMPRESA_CNPJ',
  'HOSTGATOR_EMPRESA_EMAIL',
  'HOSTGATOR_ADMIN_NOME',
  'HOSTGATOR_ADMIN_EMAIL',
  'HOSTGATOR_ADMIN_PASSWORD',
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return null;
  }

  return dotenv.parse(fs.readFileSync(envPath, 'utf8'));
}

function isPlaceholderValue(value = '') {
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return true;

  const markers = [
    'usuario',
    'senha',
    'host',
    'nome_do_banco',
    'troque_por',
    'defina-',
    'seu-token',
    'example.com',
  ];

  return markers.some((marker) => normalized.includes(marker));
}

function maskValue(key, value = '') {
  if (!value) return '';

  const upperKey = key.toUpperCase();
  if (upperKey.includes('PASSWORD') || upperKey.includes('SECRET') || upperKey.includes('TOKEN')) {
    if (value.length <= 8) return '********';
    return `${value.slice(0, 4)}********${value.slice(-4)}`;
  }

  return value;
}

function validateEnv(env) {
  const missing = [];
  const placeholders = [];

  for (const key of requiredEnvKeys) {
    const value = env[key];
    if (!value || !String(value).trim()) {
      missing.push(key);
      continue;
    }

    if (isPlaceholderValue(value)) {
      placeholders.push(key);
    }
  }

  return { missing, placeholders };
}

function buildEnvReview(env) {
  const orderedKeys = [
    ...requiredEnvKeys,
    'URL_FRONTEND',
    'CORS_ORIGIN',
    'SUPERADMIN_EMAIL',
    'SUPERADMIN_PASSWORD',
    'SUPERADMIN_NOME',
  ];

  const lines = [];
  for (const key of orderedKeys) {
    if (!(key in env)) continue;
    lines.push(`${key}=${maskValue(key, env[key])}`);
  }

  return lines.join('\n');
}

function buildEnvExport(env) {
  const orderedKeys = [
    ...requiredEnvKeys,
    'URL_FRONTEND',
    'CORS_ORIGIN',
    'SUPERADMIN_EMAIL',
    'SUPERADMIN_PASSWORD',
    'SUPERADMIN_NOME',
  ];

  const lines = [];
  for (const key of orderedKeys) {
    if (!(key in env)) continue;
    lines.push(`${key}=${env[key]}`);
  }

  return lines.join('\n');
}

function buildDeploymentSummary(env) {
  const domain = env.PUBLIC_BASE_URL || env.FRONTEND_URL || 'https://seu-dominio';
  return [
    'PRESCRIMED - RESUMO DE PREPARO HOSTGATOR',
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    '',
    'ARTEFATOS GERADOS',
    '- Template/ -> frontend estatico pronto para upload',
    '- hostgator-artifacts/node-app-manager.env.txt -> variaveis para copiar no painel',
    '- hostgator-artifacts/deploy-summary.txt -> este resumo',
    '',
    'NODE APP MANAGER',
    '- Node.js: 20.x ou superior',
    '- Mode: Production',
    '- Startup file: server.js',
    '- Application root: pasta raiz do projeto',
    '',
    'URLS PARA TESTE',
    `- ${domain}`,
    `- ${domain.replace(/\/$/, '')}/health`,
    `- ${domain.replace(/\/$/, '')}/api/auth/login`,
    '',
    'BOOTSTRAP',
    '- Depois de publicar e subir a app Node:',
    '- npm run seed:hostgator',
    '- npm run create:superadmin',
    '',
    'OBSERVACOES',
    '- Este preparo valida placeholders perigosos no .env local.',
    '- Ajuste DATABASE_URL e os secrets JWT antes da publicacao real.',
  ].join('\n');
}

function buildEnvIssuesReport(missing, placeholders) {
  const lines = [
    'PRESCRIMED - REVISAO DE AMBIENTE HOSTGATOR',
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    '',
  ];

  if (!missing.length && !placeholders.length) {
    lines.push('Status: OK');
    lines.push('Nenhuma pendencia encontrada nas variaveis obrigatorias.');
    return lines.join('\n');
  }

  lines.push('Status: PENDENTE');

  if (missing.length) {
    lines.push('');
    lines.push(`Variaveis ausentes: ${missing.join(', ')}`);
  }

  if (placeholders.length) {
    lines.push('');
    lines.push(`Variaveis com placeholder: ${placeholders.join(', ')}`);
  }

  lines.push('');
  lines.push('Ajuste essas chaves no .env.hostgator.production.local e depois rode novamente npm run hostgator:prepare.');
  return lines.join('\n');
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || rootDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} falhou com código ${code}`));
    });

    child.on('error', reject);
  });
}

async function prepareHostgatorDeploy() {
  console.log('🚀 Preparando deploy HostGator...');

  const envConfig = readEnvFile(localEnvPath);

  if (!envConfig) {
    console.warn('⚠️ Arquivo local de ambiente não encontrado: .env.hostgator.production.local');
    console.warn('⚠️ Continue apenas se as variáveis forem configuradas diretamente no painel do HostGator.');
  } else {
    console.log('✅ Arquivo local de ambiente encontrado.');

    ensureDir(artifactsDirPath);

    const { missing, placeholders } = validateEnv(envConfig);

    fs.writeFileSync(
      path.join(artifactsDirPath, 'node-app-manager.env.txt'),
      buildEnvExport(envConfig),
      'utf8'
    );
    fs.writeFileSync(
      path.join(artifactsDirPath, 'node-app-manager.env.preview.txt'),
      buildEnvReview(envConfig),
      'utf8'
    );
    fs.writeFileSync(
      path.join(artifactsDirPath, 'deploy-summary.txt'),
      buildDeploymentSummary(envConfig),
      'utf8'
    );
    fs.writeFileSync(
      path.join(artifactsDirPath, 'env-validation.txt'),
      buildEnvIssuesReport(missing, placeholders),
      'utf8'
    );

    if (missing.length) {
      console.warn(`⚠️ Variáveis obrigatórias ausentes: ${missing.join(', ')}`);
    }

    if (placeholders.length) {
      console.warn(`⚠️ Variáveis ainda com placeholder: ${placeholders.join(', ')}`);
    }

    console.log('✅ Revisão do .env registrada em hostgator-artifacts/env-validation.txt.');
    console.log('✅ Artefatos do Node App Manager gerados em hostgator-artifacts/.');
  }

  await run('npm', ['install']);
  await run('npm', ['run', 'build:template']);

  if (!fs.existsSync(clientDistPath)) {
    throw new Error('Build do frontend não foi gerado em client/dist');
  }

  if (!fs.existsSync(templateDirPath)) {
    throw new Error('Template/ não foi gerado. Verifique npm run build:template');
  }

  console.log('✅ Dependências instaladas');
  console.log('✅ Frontend compilado em client/dist');
  console.log('✅ Template pronto em Template/ para upload no public_html');
  console.log('📌 Próximos passos no HostGator:');
  console.log('   1. Enviar Template/ para o public_html');
  console.log('   2. Copiar hostgator-artifacts/node-app-manager.env.txt para o Node App Manager');
  console.log('   3. Revisar hostgator-artifacts/env-validation.txt e substituir placeholders pendentes');
  console.log('   4. Iniciar a aplicação com server.js');
  console.log('   5. Rodar npm run seed:hostgator uma vez');
}

prepareHostgatorDeploy().catch((error) => {
  console.error('❌ Falha ao preparar deploy HostGator:', error.message);
  process.exitCode = 1;
});