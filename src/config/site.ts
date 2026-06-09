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

  /** Texto da barra de aviso no topo do site (edite a vontade). */
  barraAviso: 'Envio para todo o Brasil • Pedido fácil pelo WhatsApp • 9 anos de tradição',

  /**
   * Slides do banner principal (hero) da home. Edite os textos a vontade.
   * Quando tiver as artes do Canva, da pra trocar por imagens (campo imagem).
   */
  heroSlides: [
    {
      etiqueta: '9 anos de tradição',
      titulo: 'Beleza acessível,',
      destaque: 'real e sem filtro',
      texto: 'Maquiagem e skincare selecionados com carinho, com envio para todo o Brasil.',
    },
    {
      etiqueta: 'Queridinhos',
      titulo: 'Make e skincare',
      destaque: 'que cabem no bolso',
      texto: 'Preço honesto, produto bom e atendimento próximo, do jeitinho que você merece.',
    },
    {
      etiqueta: 'Atendimento humano',
      titulo: 'Peça fácil pelo',
      destaque: 'WhatsApp',
      texto: 'Você escolhe, a gente conversa e cuida do resto. Rápido e sem complicação.',
    },
  ],

  /** Descricao usada em SEO e Open Graph (preview ao compartilhar link). */
  descricao:
    'Maquiagem e skincare com beleza acessível, real e sem filtro. ' +
    'Loja em Sorocaba-SP com envio para todo o Brasil. Pedidos via WhatsApp, logo a está disponível direto via Site.',

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
   * Formato: 55 (Brasil) + DDD + numero (so digitos).
   */
  whatsapp: '5515998234551',

  /**
   * Exibir o endereco fisico no site?
   * Decisao do cliente. Por padrao deixamos desligado.
   *
   * TODO (confirmar): SIM ou NAO. Se SIM, preencher `endereco`.
   */
  mostrarEndereco: true,
  endereco: 'R. Rudnei Schonfelder, 291 - Jardim Guaiba - Sorocaba/SP', // TODO (assets reais): preencher se mostrarEndereco = true

  /**
   * Mostrar precos no catalogo (true) ou pedir para consultar no WhatsApp (false)?
   * Padrao = mostrar. Tambem da pra ocultar preco por produto no schema.
   */
  mostrarPrecos: true,

  /** Redes e contatos. */
  instagramUsuario: 'lojinhadamiih_',
  instagramUrl: 'https://instagram.com/lojinhadamiih_',

  /**
   * ID do feed do Behold.so (gratis) para mostrar os ultimos posts do
   * Instagram na home. Vazio = secao do Instagram fica escondida.
   * Ver deploy/EXTRAS.md para o passo a passo.
   */
  beholdFeedId: '',

  /** E-mail de contato (recebido via Cloudflare Email Routing, encaminhado pro Gmail). */
  email: 'contato@lojinhadamiih.com.br',

  /**
   * Endereco do painel (PocketBase) de onde o site le os produtos.
   * O build busca os produtos aqui. Trocar quando migrar o dominio.
   * Deixe vazio ('') para usar os produtos de exemplo do JSON local.
   */
  pocketbaseUrl: 'https://painel.lmstore.veraxlegalops.com.br',

  /**
   * CHECKOUT (Mercado Pago) - travas de seguranca.
   *
   * IMPORTANTE: aqui SO entram dados publicos. A chave SECRETA (access token)
   * fica APENAS no servidor, em variavel de ambiente (MP_ACCESS_TOKEN), nunca
   * neste arquivo nem no navegador.
   */
  checkout: {
    /** Liga/desliga o checkout no site. Mantenha false ate validar em sandbox. */
    ativo: false,
    /** Ambiente: 'sandbox' (teste, sem dinheiro real) ou 'producao'. */
    ambiente: 'sandbox' as 'sandbox' | 'producao',
    /** Chave PUBLICA do Mercado Pago (pode ficar no site; nao e secreta). */
    mpPublicKey: '',
    /** Quantidade maxima por item (trava anti-abuso). */
    maxQtdItem: 20,
  },
} as const;

export type SiteConfig = typeof site;
