/**
 * Videos (YouTube / Instagram) gerenciados pelo painel (roda no navegador).
 *
 * Le a colecao `videos` do PocketBase (List/View destravados) e converte cada
 * URL para o link de "embed" certo. Se a colecao nao existir ou estiver vazia,
 * retorna [] e a secao de videos fica escondida.
 */
import { site } from '../config/site';

export interface VideoItem {
  titulo: string;
  embedUrl: string;
}

/** Converte uma URL de YouTube ou Instagram para a URL de embed (iframe). */
export function paraEmbed(url: string): string {
  const u = String(url || '').trim();
  if (!u) return '';

  // YouTube: watch?v=, youtu.be/, shorts/, embed/
  const yt =
    u.match(/[?&]v=([\w-]{6,})/) ||
    u.match(/youtu\.be\/([\w-]{6,})/) ||
    u.match(/youtube\.com\/shorts\/([\w-]{6,})/) ||
    u.match(/youtube\.com\/embed\/([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Instagram: reel/, p/, tv/  -> usa o endpoint /embed do proprio post.
  const ig = u.match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/);
  if (ig) return `https://www.instagram.com/${ig[1]}/${ig[2]}/embed`;

  return '';
}

export async function carregarVideos(limite = 12): Promise<VideoItem[]> {
  const base = site.pocketbaseUrl;
  if (!base) return [];
  try {
    const url =
      `${base}/api/collections/videos/records` +
      `?perPage=${limite}&sort=ordem&filter=${encodeURIComponent('ativo=true')}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: any = await res.json();
    const itens: any[] = Array.isArray(data?.items) ? data.items : [];
    return itens
      .map((v) => ({ titulo: String(v.titulo || ''), embedUrl: paraEmbed(v.url) }))
      .filter((v) => v.embedUrl);
  } catch (_) {
    return [];
  }
}
