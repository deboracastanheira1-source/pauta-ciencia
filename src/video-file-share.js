// Carrega o arquivo antes de o usuário abrir a janela nativa de compartilhamento.
// O segundo clique evita perder a ativação do usuário durante o download.
export async function prepareVideoFile(video,fetchImpl=fetch){
  const response=await fetchImpl(video.src);
  if(!response.ok)throw new Error('Falha ao carregar o vídeo.');
  const blob=await response.blob();
  if(!blob.size||(!blob.type.startsWith('video/')&&blob.type!=='application/octet-stream')){
    throw new Error('O endereço não retornou um arquivo de vídeo.');
  }
  const extension=video.type==='video/webm'?'webm':'mp4';
  return new File([blob],video.slug+'.'+extension,{type:video.type||blob.type});
}
export function shareVideoFile(file,device=navigator){
  if(!device.share||!device.canShare?.({files:[file]})){
    throw new Error('Este navegador não permite compartilhar o arquivo.');
  }
  // Não envie URL junto: o destino deve receber a mídia, não apenas o link.
  return device.share({files:[file]});
}
