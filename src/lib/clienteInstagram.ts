/**
 * Feed do Instagram via Behold.so (roda no navegador).
 *
 * Configure o ID do feed em src/config/site.ts (beholdFeedId). Se vazio, a
 * secao do Instagram fica escondida. O Behold cuida da conexao com a Meta.
 *
 * TODO (ao ter o feed): confirmar os nomes dos campos do JSON do Behold e
 * ajustar o mapeamento abaixo se necessario (varia por versao do Behold).
 */
import { site } from '../config/site';

export interface PostIG {
  permalink: string;
  img: string;
  video: boolean;
}

export async function carregarInstagram(limite = 8): Promise<PostIG[]> {
  const feed = site.beholdFeedId;
  if (!feed) return [];
  try {
    const res = await fetch(`https://feeds.behold.so/${feed}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: any = await res.json();
    const posts: any[] = Array.isArray(data) ? data : data.posts || [];
    return posts
      .slice(0, limite)
      .map((p) => ({
        permalink: p.permalink || p.url || site.instagramUrl,
        img:
          (p.sizes && (p.sizes.medium?.mediaUrl || p.sizes.small?.mediaUrl)) ||
          p.mediaUrl ||
          p.thumbnailUrl ||
          '',
        video: String(p.mediaType || '').toUpperCase() === 'VIDEO',
      }))
      .filter((p: PostIG) => p.img);
  } catch (_) {
    return [];
  }
}
