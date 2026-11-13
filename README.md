# Pauta Ciência

Portal estático em React, Vite e CSS responsivo. Sem login, backend ou formulário. Fontes Google são opcionais: há fontes locais de fallback.

## Executar

Instale Node.js 22 ou superior, com npm. Na pasta do projeto:

```sh
npm install
npm run dev
npm run build
npm run preview
```

O build é gerado em `dist`.

## Cloudflare Pages — plano gratuito

Envie este projeto para um repositório Git. No Cloudflare, abra Workers & Pages, crie um projeto Pages e conecte o repositório. Use:

- Preset: Vite (ou None)
- Comando de build: `npm run build`
- Diretório de saída: `dist`
- Versão Node: 22 (arquivo `.node-version` incluído)
- Diretório raiz: a pasta que contém este package.json

Também é possível executar o build local e enviar o conteúdo de `dist` pela opção de upload de assets do Pages. No Pages, o fallback SPA padrão atende às URLs internas quando não há um arquivo 404.html no diretório de saída. Não requer variáveis secretas, Functions ou banco de dados. A publicação não foi realizada nesta entrega.

## Adicionar notícias

Crie um arquivo JSON em `src/content/`, copiando o formato de `prevencao-sifilis.json`. Todos são carregados automaticamente no build. Use slug único (minúsculas e hífens), título, resumo, área, DOI, URL original e caminho de imagem em `public/`. `date` aceita `YYYY-MM-DD` ou `null` (mostra “Data em revisão”). `featured: true` exibe a pauta na página inicial. `review` contém os campos de revisão editorial. Faça novo build após editar conteúdo. As pautas com status de revisão ficam visíveis e claramente identificadas; não coloque notas confidenciais nos arquivos.

## Matéria sobre sífilis congênita

O texto aprovado é mantido integralmente em src/content/articles/sifilis-congenita-prevencao-brasil.md. Os metadados, os indicadores em destaque e a associação com a capa ficam em src/content/prevencao-sifilis.json. A URL é /noticias/sifilis-congenita-prevencao-brasil; a URL anterior continua reconhecida pelo React.

A capa da matéria é a fotografia enviada pela responsável pelo projeto, com a legenda “Imagem meramente ilustrativa.”. Ela não está abrangida pela licença CC BY 4.0 das ilustrações originais, que continuam documentadas em public/LICENCA-ILUSTRACAO.md.

O comando npm run build gera, além da SPA, um HTML específico para a matéria com texto completo e metadados SEO/Open Graph, disponível sem execução de JavaScript. O domínio padrão dos metadados é https://pautaciencia.com.br. Se o domínio público for outro, configure VITE_SITE_URL no ambiente de build (valor público, sem credenciais). Não há alteração de DNS ou e-mail.

## Páginas

- `/`: chamada, destaque e apresentação
- `/noticias`: listagem e busca por título, área e DOI
- `/noticias/:slug`: pauta e referência original
- `/videos`: vídeos associados aos artigos
- `/sobre`: propósito e princípios editoriais
- `/contato`: link de e-mail para imprensa@pautaciencia.com.br

Navegação responsiva, link para pular ao conteúdo, indicação de página ativa e foco visível. Nenhuma coleta de dados ou armazenamento local.

## Vídeos curtos

A página /videos recebe vídeos de arquivos JSON em src/content/videos/. Ela começa vazia, sem vídeos ou resultados científicos fictícios.

1. Copie modelo.json.example para um arquivo com extensão .json nessa pasta.
2. Coloque o vídeo MP4 em public/videos/ e informe seu caminho em src. Também aceita URL HTTPS direta de um arquivo de vídeo, sem iframe.
3. Preencha título, descrição, transcrição integral, imagem de capa e articleSlug com o slug exato de uma notícia existente.
4. Forneça legendas WebVTT em public/videos/ e preencha captions; remova esse campo se não houver arquivo.
5. Após revisão editorial, defina published como true e execute novo build. Apenas vídeos publicados e ligados a um artigo existente aparecem.

O player possui controles nativos, sem reprodução automática, e há transcrição expansível. A página do artigo oferece link para os vídeos quando houver conteúdo associado. Arquivos grandes podem ser hospedados em um serviço de mídia com URL direta, respeitando os limites do provedor de hospedagem. Nenhum upload pelo navegador ou backend foi adicionado.

## Cloudflare Workers Static Assets

Para o deploy em Workers, use o arquivo wrangler.json da raiz, com assets.directory apontando para ./dist e assets.not_found_handling definido como single-page-application. Execute npm run build antes de npx wrangler deploy. No build conectado ao Git, use npm run build como comando de build e npx wrangler deploy como comando de deploy.

O fallback serve index.html internamente para as páginas React, incluindo /noticias, /videos, /sobre, /contato e /noticias/:slug, preservando a URL. Não recrie a regra /* /index.html 200 em public/_redirects: ela pode produzir o erro 100324 com a normalização de HTML dos Static Assets.

A configuração não declara rotas de domínio, zonas DNS ou configurações de e-mail. O build Vite limpa dist antes de gerar os arquivos, removendo também o antigo _redirects.

## Compartilhamento de vídeos

Cada vídeo publicado recebe uma âncora /videos#slug e ações para compartilhar o link no Facebook e WhatsApp, copiar o link e abrir as opções nativas do aparelho para o Instagram. A presença do Instagram nas opções depende do sistema, navegador e aplicativos instalados. O site não publica automaticamente em contas sociais. O link de download permite salvar o vídeo para publicação manual; arquivos externos podem abrir em outra aba conforme a política do provedor. Não exige backend, tokens ou login no portal. A transcrição só aparece quando preenchida no arquivo de conteúdo.
