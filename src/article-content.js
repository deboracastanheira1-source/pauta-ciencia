import {marked} from 'marked';
// Markdown de autoria editorial, versionado no repositório; não recebe HTML de visitantes.
export function articleBodyMarkdown(article,source){
  const text=source.replace(/\r\n/g,'\n');
  if(article.bodyStartsWith){
    const start=text.indexOf(article.bodyStartsWith);
    if(start<0)throw new Error('Início do corpo não encontrado: '+article.slug);
    return text.slice(start);
  }
  return text.split(/\n\s*\n/).slice(2).join('\n\n');
}
export function renderArticleBody(article,source){
  return marked.parse(articleBodyMarkdown(article,source)).replace(/<a href="(https?:[^\"]+)"/g,'<a target="_blank" rel="noopener noreferrer" href="$1"');
}
