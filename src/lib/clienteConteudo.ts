/**
 * Cliente de CONTEUDO do site (roda no navegador).
 *
 * Le do painel (PocketBase) o conteudo editavel: configuracao geral (logo,
 * barra de aviso) e banners do hero. Tudo com fallback: se a colecao ainda
 * nao existir ou estiver vazia, o site usa os valores atuais e nada quebra.
 *
 * Colecoes esperadas no painel (ver deploy/PAINEL-CONTEUDO.md):
 *   - configuracao: { barra_aviso (text), logo (file) }
 *   - banners: { imagem (file), titulo, subtitulo, link, ordem (number), ativo (bool) }
 */
import { site } from '../config/site';

const PB = (site.pocketbaseUrl || '').replace(/\/$/, '');

export interface Banner {
  imagem: string;
  titulo: string;
  subtitulo: string;
  link: string;
}

export interface ConfigSite {
  barraAviso: string | null;
  logoUrl: string | null;
}

/** Monta a URL de um arquivo do PocketBase. */
function arquivoUrl(colecao: string, recId: string, nome: string): string {
  if (!nome) return '';
  return `${PB}/api/files/${colecao}/${recId}/${nome}`;
}

/**
 * Le a configuracao geral (primeiro registro da colecao "configuracao").
 * Sempre fresco (`no-store`) e com dedupe por carregamento de pagina.
 */
let _cacheConfig: Promise<ConfigSite> | null = null;
export function carregarConfig(): Promise<ConfigSite> {
  const vazio: ConfigSite = { barraAviso: null, logoUrl: null };
  if (!PB) return Promise.resolve(vazio);
  if (_cacheConfig) return _cacheConfig;
  _cacheConfig = (async () => {
    try {
      const res = await fetch(`${PB}/api/collections/configuracao/records?perPage=1`, {
        cache: 'no-store',
      });
      if (!res.ok) return vazio;
      const json = await res.json();
      const rec = (json.items || [])[0];
      if (!rec) return vazio;
      return {
        barraAviso: rec.barra_aviso ? String(rec.barra_aviso) : null,
        logoUrl: rec.logo ? arquivoUrl('configuracao', rec.id, rec.logo) : null,
      };
    } catch (_) {
      return vazio;
    }
  })();
  return _cacheConfig;
}

/** Le os banners ativos do hero, em ordem. Sempre fresco. */
export async function carregarBanners(): Promise<Banner[]> {
  if (!PB) return [];
  try {
    const filtro = encodeURIComponent('ativo = true');
    const res = await fetch(
      `${PB}/api/collections/banners/records?perPage=20&sort=ordem&filter=${filtro}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.items || [])
      .map((rec: any) => ({
        imagem: rec.imagem ? arquivoUrl('banners', rec.id, rec.imagem) : '',
        titulo: rec.titulo ? String(rec.titulo) : '',
        subtitulo: rec.subtitulo ? String(rec.subtitulo) : '',
        link: rec.link ? String(rec.link) : '',
      }))
      .filter((b: Banner) => b.imagem); // so banners com imagem
  } catch (_) {
    return [];
  }
}
