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

# ── SPA: redireciona tudo para index.html (HashRouter) ──────────────────────
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Permite acesso a arquivos e diretórios reais (assets, favicon, robots.txt…)
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Redireciona qualquer outra requisição para index.html
  RewriteRule ^ index.html [L]
</IfModule>

# ── página de erro personalizada ─────────────────────────────────────────────
ErrorDocument 404 /404.html

# ── cabeçalhos de segurança ──────────────────────────────────────────────────
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  Header always set X-XSS-Protection "1; mode=block"

  # CORS para chamadas à API externa (Railway)
  <FilesMatch "\.(json|js|css)$">
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
</IfModule>

# ── cache de longa duração para assets versionados ─────────────────────────
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/x-javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/ttf "access plus 1 year"
</IfModule>

# ── compressão gzip ──────────────────────────────────────────────────────────
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE font/woff2 font/woff font/ttf
</IfModule>
`;

const page404Content = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prescrimed - Redirecionando...</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center;
           min-height: 100vh; margin: 0; background: #f1f5f9; color: #334155; }
    .box { text-align: center; padding: 2rem; }
    a { color: #6366f1; text-decoration: none; font-weight: 600; }
  </style>
  <script>
    // Redireciona para a raiz do site preservando o hash (para HashRouter)
    window.location.replace('./');
  </script>
</head>
<body>
  <div class="box">
    <p>Redirecionando... <a href="./">clique aqui</a> se não for redirecionado automaticamente.</p>
  </div>
</body>
</html>`;

const instructionsContent = `=============================================================
  PRESCRIMED - PUBLICACAO HOSTGATOR
  Gerado automaticamente por: npm run build:template
=============================================================

CONTEUDO DESTA PASTA
---------------------
  index.html     -> Entrada principal do SPA React
  assets/        -> JS, CSS e fontes minificados (cache longo)
  .htaccess      -> Rewrite rules para SPA + segurança + gzip
  404.html       -> Pagina de fallback que redireciona ao root
  favicon.ico    -> Icone do sistema
  robots.txt     -> Instrucoes para indexadores

COMO PUBLICAR NO HOSTGATOR
---------------------------
1. Acesse o cPanel da sua conta Hostgator.
2. Abra o Gerenciador de Arquivos e navegue ate public_html
   (ou uma subpasta, ex: public_html/prescrimed/).
3. Envie TODO o conteudo desta pasta (incluindo .htaccess e a pasta assets/).
4. Certifique-se de que o arquivo .htaccess foi enviado
   (arquivos que começam com ponto podem estar ocultos no FTP – habilite "mostrar arquivos ocultos").
5. Acesse o dominio no navegador e teste o login.

CONFIGURACAO DA API
-------------------
  -> O frontend aponta para: https://prescrimed.up.railway.app/api
  -> O backend continua rodando no Railway (Node.js + PostgreSQL).
  -> Se o dominio do backend mudar, edite:
       client/.env.hostgator  (variavel VITE_API_URL)
     e rebuild com:
       npm run build:template

RESPONSIVIDADE
--------------
  -> Layout 100% responsivo: mobile, tablet e desktop.
  -> Testado com Tailwind CSS e componentes adaptativos.

SUPORTE
-------
  -> Sistema: Prescrimed v1.0
  -> Em caso de duvidas, contate o desenvolvedor.
=============================================================
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
  fs.writeFileSync(path.join(templateDir, '404.html'), page404Content, 'utf8');
  fs.writeFileSync(path.join(templateDir, 'LEIA-ME-HOSTGATOR.txt'), instructionsContent, 'utf8');

  // Exibe resumo dos arquivos gerados
  const files = fs.readdirSync(templateDir);
  const assetsCount = fs.existsSync(path.join(templateDir, 'assets'))
    ? fs.readdirSync(path.join(templateDir, 'assets')).length
    : 0;

  console.log('');
  console.log('✅ Template Hostgator pronto em Template/');
  console.log(`   Arquivos raiz : ${files.length}`);
  console.log(`   Assets        : ${assetsCount} arquivos em assets/`);
  console.log('');
  console.log('📦 Para publicar: envie TODO o conteúdo de Template/ para o public_html da Hostgator.');
  console.log('');
  process.exit(0);
} catch (error) {
  console.error('❌ Falha ao gerar Template:', error.message);
  process.exit(1);
}