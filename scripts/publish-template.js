#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const distDir = path.join(root, 'client', 'dist');
const templateDir = path.join(root, 'Template');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const currentPath = path.join(dir, entry);
    const stat = fs.statSync(currentPath);
    if (stat.isDirectory()) {
      cleanDir(currentPath);
      fs.rmdirSync(currentPath);
    } else {
      fs.unlinkSync(currentPath);
    }
  }
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src)) {
    const sourcePath = path.join(src, entry);
    const destinationPath = path.join(dest, entry);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      copyDir(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

const htaccessContent = `Options -Indexes
DirectoryIndex index.html

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
  ExpiresByType application/x-javascript "access plus 7 days"
  ExpiresByType image/svg+xml "access plus 30 days"
  ExpiresByType image/x-icon "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType font/woff2 "access plus 30 days"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
`;

const instructionsContent = `PUBLICACAO HOSTGATOR - TEMPLATE

Esta pasta contem o frontend estatico pronto para upload em hospedagem compartilhada.

Passos:
1. Envie todo o conteudo desta pasta para public_html ou para a subpasta desejada na HostGator.
2. Mantenha os arquivos e a pasta assets exatamente como foram gerados.
3. O frontend desta versao aponta para a API em https://prescrimed.up.railway.app/api.
4. Se o backend mudar de dominio, edite client/.env.hostgator e rode npm run build:template novamente.

Observacao importante:
- Este pacote publica apenas o frontend React.
- O backend Node.js/Express com PostgreSQL continua precisando rodar em um ambiente compativel, como Railway, VPS ou HostGator com suporte real a Node e Postgres.
- O layout responsivo ja esta preservado no build, com suporte a mobile, tablet e desktop.
`;

try {
  if (!fs.existsSync(distDir)) {
    console.error('❌ Build não encontrado em client/dist. Execute: npm run build:template');
    process.exit(1);
  }

  ensureDir(templateDir);
  cleanDir(templateDir);
  copyDir(distDir, templateDir);

  fs.writeFileSync(path.join(templateDir, '.htaccess'), htaccessContent, 'utf8');
  fs.writeFileSync(path.join(templateDir, 'LEIA-ME-HOSTGATOR.txt'), instructionsContent, 'utf8');

  console.log('✅ Template pronto em Template/');
  process.exit(0);
} catch (error) {
  console.error('❌ Falha ao gerar Template:', error.message);
  process.exit(1);
}