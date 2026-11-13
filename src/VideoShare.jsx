import React, {useState} from 'react';
export default function VideoShare({video}) {
  const [message,setMessage]=useState('');
  const [showLink,setShowLink]=useState(false);
  const origin=import.meta.env.VITE_SITE_URL||'https://pautaciencia.com.br';
  const url=new URL('/videos#'+encodeURIComponent(video.slug),origin).href;
  async function copy(){
    try{await navigator.clipboard.writeText(url);setMessage('Link copiado. Cole na conversa ou na rede social.');}
    catch{setShowLink(true);setMessage('Selecione e copie o link abaixo.');}
  }
  async function instagram(){
    if(navigator.share){
      try{await navigator.share({title:video.title,text:video.title+' — Pauta Ciência',url});setMessage('Opções de compartilhamento abertas.');}
      catch(error){if(error.name!=='AbortError'){setShowLink(true);setMessage('Não foi possível abrir as opções. Copie o link ou baixe o vídeo para publicar no Instagram.');}}
    }else{setShowLink(true);setMessage('Para o Instagram, copie o link ou baixe o vídeo e publique pelo aplicativo.');}
  }
  return <section className="video-share" aria-label={'Compartilhar: '+video.title}>
    <h3>Compartilhe esta pauta</h3>
    <div className="share-actions">
      <button type="button" onClick={instagram} aria-describedby={'instagram-help-'+video.slug}>Instagram</button>
      <a href={'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)} target="_blank" rel="noopener noreferrer">Facebook ↗</a>
      <a href={'https://wa.me/?text='+encodeURIComponent(video.title+' — Pauta Ciência\n'+url)} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
      <button type="button" onClick={copy}>Copiar link</button>
    </div>
    <p id={'instagram-help-'+video.slug} className="share-help">No celular, escolha Instagram nas opções de compartilhamento, se disponível. Para publicar como Reel, <a href={video.src} download>baixe o vídeo</a> e use o aplicativo.</p>
    {showLink&&<label className="share-link">Link do vídeo<input readOnly value={url} onFocus={e=>e.target.select()}/></label>}
    <p className="share-status" role="status" aria-live="polite">{message}</p>
  </section>;
}
