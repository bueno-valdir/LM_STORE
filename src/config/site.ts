/**
 * Configuracao geral do site (parametros editaveis sem mexer no codigo).
 *
 * Aqui ficam numero de WhatsApp, redes sociais, textos institucionais e
 * opcoes de comportamento do catalogo. Edite este arquivo para atualizar
 * contatos e mensagens em todo o site de uma vez.
 */

export const site = {
  /** Nome da marca, usado em titulos e SEO. */
  nome: 'Lojinha da Miih',

  /** Frase curta de posicionamento (aparece no hero e em metatags). */
  slogan: 'Make e skincare que cabem no bolso',

  /** Descricao usada em SEO e Open Graph (preview ao compartilhar link). */
  descricao:
    'Maquiagem e skincare com beleza acessivel, real e sem filtro. ' +
    'Loja em Sorocaba-SP com envio para todo o Brasil. Pedidos pelo WhatsApp.',

  /** Anos de tradicao da loja (usado no Sobre e em destaques de confianca). */
  anosDeTradicao: 9,

  /** Cidade e estado da loja. */
  cidade: 'Sorocaba-SP',

  /**
   * Fase de desenvolvimento.
   * Quando true, o site pede aos buscadores para NAO indexar (noindex), para
   * o site em construcao nao aparecer no Google. Trocar para false ao publicar
   * a versao final (ja com produtos reais).
   */
  emDesenvolvimento: true,

  /**
   * Numero de WhatsApp no formato internacional, somente digitos.
   * Formato esperado: 55 + DDD + numero. Ex.: 5515999999999.
   *
   * TODO (assets reais): PREENCHER com o numero real da loja.
   */
  whatsapp: '5515999999999',

  /**
   * Exibir o endereco fisico no site?
   * Decisao do cliente. Por padrao deixamos desligado.
   *
   * TODO (confirmar): SIM ou NAO. Se SIM, preencher `endereco`.
   */
  mostrarEndereco: false,
  endereco: '', // TODO (assets reais): preencher se mostrarEndereco = true

  /**
   * Mostrar precos no catalogo (true) ou pedir para consultar no WhatsApp (false)?
   * Padrao = mostrar. Tambem da pra ocultar preco por produto no schema.
   */
  mostrarPrecos: true,

  /** Redes e contatos. */
  instagramUsuario: 'lojinhadamiih_',
  instagramUrl: 'https://instagram.com/lojinhadamiih_',

  /** E-mail de contato (opcional). TODO (confirmar): preencher ou deixar vazio. */
  email: '',

  /**
   * Endereco do painel (PocketBase) de onde o site le os produtos.
   * O build busca os produtos aqui. Trocar quando migrar o dominio.
   * Deixe vazio ('') para usar os produtos de exemplo do JSON local.
   */
  pocketbaseUrl: 'https://painel.lmstore.veraxlegalops.com.br',
} as const;

export type SiteConfig = typeof site;
