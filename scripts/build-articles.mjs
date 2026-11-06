import fs from 'node:fs';
import path from 'node:path';
import {marked} from 'marked';
const origin=new URL(process.env.VITE_SITE_URL||'https://pautaciencia.com.br').origin;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const template=fs.readFileSync('dist/index.html','utf8');
for(const name of fs.readdirSync('src/content').filter(n=>n.endsWith('.json'))){
 const a=JSON.parse(fs.readFileSync(path.join('src/content',name),'utf8'));
 if(!a.contentFile)continue;
 const source=fs.readFileSync(path.join('src/content/articles',a.contentFile),'utf8');
 const url=new URL('/noticias/'+a.slug,origin).href;
 const image=new URL(a.image,origin).href;
 const title=a.title+' | Pauta Ciência';
 const metadata=`<link rel="canonical" href="${escape(url)}"/><meta property="og:locale" content="pt_BR"/><meta property="og:site_name" content="Pauta Ciência"/><meta property="og:type" content="article"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(a.subtitle)}"/><meta property="og:url" content="${escape(url)}"/><meta property="og:image" content="${escape(image)}"/><meta property="og:image:type" content="${escape(a.imageType||'image/png')}"/><meta property="og:image:alt" content="${escape(a.imageAlt)}"/><meta property="article:section" content="${escape(a.area)}"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(title)}"/><meta name="twitter:description" content="${escape(a.subtitle)}"/><meta name="twitter:image" content="${escape(image)}"/>`;
 // HTML estático permite leitura e metadados antes de o React iniciar.
 const body=`<header><div class="header-inner"><a class="brand" href="/">pauta<span>ciência.</span></a><nav aria-label="Principal"><a href="/">Início</a><a href="/noticias">Notícias</a><a href="/videos">Vídeos</a><a href="/sobre">Sobre</a><a href="/contato">Contato</a></nav></div></header><main id="conteudo" class="wrap section article-page"><a href="/noticias" class="text-link">← Voltar às notícias</a><div class="eyebrow article-area">${escape(a.area)}</div><article class="article-body">${marked.parse(source)}</article><figure><img src="${escape(a.image)}" alt="${escape(a.imageAlt)}"/><figcaption>${escape(a.imageCredit)} ${a.imageLicense?`<a href="${escape(a.imageLicense)}">Ver licença</a>`:''}</figcaption></figure></main>`;
 let html=template.replace(/<title>.*?<\/title>/s,`<title>${escape(title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${escape(a.subtitle)}"/>`).replace('</head>',metadata+'</head>').replace('<div id="root"></div>',`<div id="root">${body}</div>`);
 const output=path.join('dist/noticias',a.slug+'.html');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,html);
 console.log('Página estática e SEO: '+output);
}
