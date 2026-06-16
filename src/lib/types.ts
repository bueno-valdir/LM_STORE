/**
 * Tipos do dominio da loja.
 *
 * Mantemos o schema do produto em um lugar so para facilitar a migracao
 * futura para um CMS sem reescrever o front. As paginas consomem esses tipos.
 */

/**
 * Categoria do produto. Guarda o SLUG de uma subcategoria (a folha da arvore),
 * por exemplo `base`, `batom`, `sombras`. A arvore completa de categorias e
 * subcategorias fica em src/config/categorias.ts (fonte unica da verdade).
 */
export type Categoria = string;

/** Disponibilidade do produto. */
export type Disponibilidade = 'em-estoque' | 'esgotado';

/** Imagem de um produto. */
export interface ImagemProduto {
  /** Caminho da imagem (em /public) ou URL. */
  src: string;
  /** Texto alternativo para acessibilidade. Descreva o produto. */
  alt: string;
}

/** Estrutura de um produto do catalogo. */
export interface Produto {
  /** Identificador unico e estavel (usado na URL e na mensagem do WhatsApp). */
  id: string;
  /** Nome do produto. */
  nome: string;
  /** Marca/fabricante. */
  marca: string;
  /** Categoria principal. */
  categoria: Categoria;
  /** Descricao do produto. */
  descricao: string;
  /** Preco cheio, em reais. Use null para ocultar o preco deste produto. */
  preco: number | null;
  /** Preco promocional opcional, em reais. Quando presente, vira o preco em destaque. */
  precoPromocional?: number | null;
  /** Tom ou cor (para maquiagem). Opcional. */
  tom?: string | null;
  /** Volume/ml ou peso. Opcional (mais comum em skincare). */
  volume?: string | null;
  /** Lista de imagens. A primeira e usada como capa. */
  imagens: ImagemProduto[];
  /** Disponibilidade atual. */
  disponibilidade: Disponibilidade;
  /** Produto em destaque (aparece na home). */
  destaque: boolean;
  /** Produto em promocao (recebe etiqueta e entra na faixa de promocoes). */
  promocao: boolean;
}

/** Metadados de exibicao de cada categoria. */
export interface CategoriaInfo {
  slug: Categoria;
  rotulo: string;
}
