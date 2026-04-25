Template para hospedagem no Hostgator (arquivos estáticos)

Instruções de preparo:

1) Gerar build do frontend (local):
   cd client
   npm install
   npm run build

2) Copiar os arquivos gerados para a pasta Template:
   - Copie todo o conteúdo de `client/dist` para `Template/`, substituindo quando solicitado.
   - Certifique-se de que `Template/assets` contenha os arquivos JS/CSS/woff gerados.

3) Conteúdo mínimo necessário para upload via FTP (Hostgator):
   - index.html
   - assets/ (pasta inteira do build)
   - pattern.svg
   - favicon.ico (se existir)
   - _redirects (para Netlify / Surge; opcional em Hostgator)
   - .htaccess (importante para SPA em Apache)
   - _headers (opcional)
   - 404.html, limpar-cache.html
   - robots.txt

4) Deploy no Hostgator
   - Conecte via FTP/SFTP ao Hostgator.
   - Faça upload dos arquivos para a pasta `public_html` (ou subpasta desejada).
   - Se for usar subpasta, atualize os caminhos em `index.html` ou prefira colocar tudo na raiz do site.

5) Observações
   - O backend (API) precisa estar disponível e configurado; o projeto já aponta para um backend Railway em `_redirects`.
   - Se tiver problemas com cache, limpe o cache do navegador e use a página `limpar-cache.html`.

6) Validação local simples
   - Após copiar os arquivos, você pode rodar um servidor estático localmente para verificar:
     npx serve Template -s -l 5000

Se quiser, eu posso copiar automaticamente o conteúdo de `client/dist` para `Template/` agora e commitar as mudanças. Deseja que eu faça isso e dê push para o GitHub?