import React, {useState} from 'react';
import {prepareVideoFile,shareVideoFile} from './video-file-share.js';
export default function VideoShare({video}) {
  const [message,setMessage]=useState('');
  const [showLink,setShowLink]=useState(false);
  const [file,setFile]=useState(null);
  const [busy,setBusy]=useState(false);
  const origin=import.meta.env.VITE_SITE_URL||'https://pautaciencia.com.br';
  const url=new URL('/videos#'+encodeURIComponent(video.slug),origin).href;
  async function copy(){
    try{await navigator.clipboard.writeText(url);setMessage('Link copiado. Cole na conversa ou na rede social.');}
    catch{setShowLink(true);setMessage('Selecione e copie o link abaixo.');}
  }
  async function instagram(){
    if(busy)return;
    if(!navigator.share||!navigator.canShare||typeof File==='undefined'){
      setShowLink(true);setMessage('Este navegador não permite compartilhar o arquivo. Baixe o vídeo e publique pelo aplicativo do Instagram.');return;
    }
    setBusy(true);
    try{
      if(!file){
        setMessage('Carregando o vídeo para compartilhar. Aguarde…');
        const prepared=await prepareVideoFile(video);
        if(!navigator.canShare({files:[prepared]}))throw new Error('Compartilhamento indisponível.');
        setFile(prepared);
        setMessage('Vídeo pronto. Toque em “Compartilhar vídeo” e escolha Instagram ou Stories, se disponível.');
      }else{
        // A chamada ocorre no clique, sem esperar uma requisição de rede.
        await shareVideoFile(file);
        setMessage('Vídeo enviado às opções de compartilhamento. Conclua a publicação no aplicativo escolhido.');
      }
    }catch(error){
      if(error.name==='AbortError')setMessage('Compartilhamento cancelado. Você pode tentar novamente.');
      else{setShowLink(true);setMessage('Não foi possível compartilhar o arquivo neste aparelho. Baixe o vídeo e publique pelo Instagram.');}
    }finally{setBusy(false);}
  }
  return <section className="video-share" aria-label={'Compartilhar: '+video.title}>
    <h3>Compartilhe esta pauta</h3>
    <div className="share-actions">
      <button type="button" onClick={instagram} disabled={busy} aria-describedby={'instagram-help-'+video.slug}>{busy?'Aguarde…':file?'Compartilhar vídeo':'Instagram — preparar vídeo'}</button>
      <a href={'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)} target="_blank" rel="noopener noreferrer">Facebook ↗</a>
      <a href={'https://wa.me/?text='+encodeURIComponent(video.title+' — Pauta Ciência\n'+url)} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
      <button type="button" onClick={copy}>Copiar link</button>
    </div>
    <p id={'instagram-help-'+video.slug} className="share-help">Prepare o vídeo e toque em “Compartilhar vídeo”. Escolha Instagram ou Stories, se aparecer nas opções do celular. Você confirma a publicação no aplicativo. Se a opção não aparecer, <a href={video.src} download>baixe o vídeo</a> para publicar manualmente.</p>
    {showLink&&<label className="share-link">Link do vídeo<input readOnly value={url} onFocus={e=>e.target.select()}/></label>}
    <p className="share-status" role="status" aria-live="polite">{message}</p>
  </section>;
}
