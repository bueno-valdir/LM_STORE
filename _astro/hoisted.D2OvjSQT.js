const g={whatsapp:"5515998234551",pocketbaseUrl:"https://painel.lmstore.veraxlegalops.com.br"},m="/LM_STORE";function x(t){if(/^([a-z]+:)?\/\//i.test(t)||t.startsWith("#"))return t;const o=m.endsWith("/")?m.slice(0,-1):m,a=t.startsWith("/")?t:`/${t}`;return`${o}${a}`}const i=g.pocketbaseUrl.replace(/\/$/,""),j={maquiagem:"Maquiagem",skincare:"Skincare","kits-presentes":"Kits e Presentes"};function h(t){if(t===""||t===null||t===void 0)return null;const o=Number(t);return Number.isFinite(o)?o:null}function n(t){return(t||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function U(t){return(t||"").replace(/<\s*br\s*\/?>/gi,`
`).replace(/<\/(p|div|li|h[1-6])>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/\n{3,}/g,`

`).trim()}function v(t){const a=(Array.isArray(t.imagens)?t.imagens:t.imagens?[t.imagens]:[]).map(e=>({src:`${i}/api/files/produtos/${t.id}/${e}`,alt:t.nome||"Produto"}));return{id:t.id,nome:t.nome||"",marca:t.marca||"",categoria:t.categoria||t.select||"",descricao:t.descricao||"",preco:h(t.preco),precoPromocional:h(t.preco_promocional),tom:t.tom||null,volume:t.volume||null,imagens:a.length?a:[{src:x("/images/products/placeholder-1.svg"),alt:t.nome||"Produto"}],disponivel:!!t.disponivel,destaque:!!t.destaque,promocao:!!t.promocao}}async function k(){if(!i)return[];const t=await fetch(`${i}/api/collections/produtos/records?perPage=200&sort=-created`);if(!t.ok)throw new Error("HTTP "+t.status);return((await t.json()).items||[]).map(v)}async function A(t){if(!i||!t)return null;const o=await fetch(`${i}/api/collections/produtos/records/${encodeURIComponent(t)}`);return o.ok?v(await o.json()):null}function $(t){return j[t]||t||""}function f(t){return t==null?null:t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function b(t){return typeof t.precoPromocional=="number"&&t.precoPromocional>0?{atual:t.precoPromocional,de:t.preco,promo:!0}:{atual:t.preco,de:null,promo:!1}}function S(t){const o=[`Olá! Tenho interesse no produto: ${t.nome} (${t.id})`];t.tom&&o.push(`, tom ${t.tom}`);const{atual:a}=b(t),e=f(a);return e&&o.push(` - ${e}`),`https://wa.me/${g.whatsapp}?text=${encodeURIComponent(o.join(""))}`}function B(t,o,a,e){if(!e.length)return"";const c=e.map(s=>`<div class="min-w-[46%] snap-start sm:min-w-[31%] lg:min-w-[23%]">${q(s)}</div>`).join(""),r=(s,u,d)=>`<button type="button" class="carrossel-${s} grid h-9 w-9 place-items-center rounded-full border border-fundo-borda text-texto transition-colors hover:border-marca hover:text-marca" aria-label="${u}">${d}</button>`;return`
  <section class="container-loja py-8">
    <div class="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 class="font-titulo text-2xl font-bold text-texto">${n(t)}</h2>
        ${o?`<p class="text-sm text-texto-suave">${n(o)}</p>`:""}
      </div>
      <div class="flex items-center gap-2">
        <a href="${n(a)}" class="hidden text-sm font-medium text-marca-escuro hover:underline sm:inline">Ver tudo</a>
        ${r("prev","Anterior","&lsaquo;")}
        ${r("next","Próximo","&rsaquo;")}
      </div>
    </div>
    <div class="carrossel-track flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2">${c}</div>
  </section>`}function q(t){const{atual:o,de:a,promo:e}=b(t),c=f(o),r=f(a),s=!t.disponivel,u=t.imagens[0],d=`
    <div class="absolute left-2 top-2 flex flex-col gap-1">
      ${e?'<span class="etiqueta bg-marca text-white">Promoção</span>':""}
      ${s?'<span class="etiqueta bg-preto/80 text-white">Esgotado</span>':""}
    </div>`,P=c?`<div class="flex items-baseline gap-2">
           <span class="font-titulo text-base font-bold text-marca">${c}</span>
           ${e&&r?`<span class="text-xs text-texto-suave line-through">${r}</span>`:""}
         </div>`:'<span class="text-sm font-medium text-texto-suave">Consultar no WhatsApp</span>';return`
  <a href="${x("/produto")}?id=${encodeURIComponent(t.id)}"
     class="group flex flex-col overflow-hidden rounded-marca border border-fundo-borda bg-fundo shadow-card transition-colors hover:border-marca">
    <div class="relative aspect-square overflow-hidden bg-fundo-claro">
      <img src="${n(u.src)}" alt="${n(u.alt)}" width="600" height="600" loading="lazy" decoding="async"
           class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ${d}
    </div>
    <div class="flex flex-1 flex-col gap-1 p-3">
      <span class="text-xs uppercase tracking-wide text-texto-suave">${n(t.marca)} &middot; ${n($(t.categoria))}</span>
      <h3 class="font-titulo text-sm font-semibold leading-snug text-texto">${n(t.nome)}</h3>
      <div class="mt-auto pt-2">${P}</div>
    </div>
  </a>`}const l=g.pocketbaseUrl.replace(/\/$/,"");function w(t,o,a){return a?`${l}/api/files/${t}/${o}/${a}`:""}async function y(){const t={barraAviso:null,logoUrl:null};if(!l)return t;try{const o=await fetch(`${l}/api/collections/configuracao/records?perPage=1`);if(!o.ok)return t;const e=((await o.json()).items||[])[0];return e?{barraAviso:e.barra_aviso?String(e.barra_aviso):null,logoUrl:e.logo?w("configuracao",e.id,e.logo):null}:t}catch{return t}}async function L(){if(!l)return[];try{const t=encodeURIComponent("ativo = true"),o=await fetch(`${l}/api/collections/banners/records?perPage=20&sort=ordem&filter=${t}`);return o.ok?((await o.json()).items||[]).map(e=>({imagem:e.imagem?w("banners",e.id,e.imagem):"",titulo:e.titulo?String(e.titulo):"",subtitulo:e.subtitulo?String(e.subtitulo):"",link:e.link?String(e.link):""})).filter(e=>e.imagem):[]}catch{return[]}}y().then(t=>{if(t.barraAviso){const o=document.getElementById("barra-aviso");o&&(o.textContent=t.barraAviso)}});const p=document.getElementById("menu-categorias");p&&k().then(t=>{const o=Array.from(new Set(t.map(a=>a.categoria).filter(Boolean)));if(!o.length){p.innerHTML='<p class="px-3 py-2 text-xs text-white/50">Em breve</p>';return}p.innerHTML=o.map(a=>`<a href="${x("/catalogo")}?cat=${encodeURIComponent(a)}" class="block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-marca-claro">${n($(a))}</a>`).join("")}).catch(()=>{p.innerHTML='<p class="px-3 py-2 text-xs text-white/50">Indisponível</p>'});y().then(t=>{if(!t.logoUrl)return;const o=`<img src="${t.logoUrl}" alt="Lojinha da Miih" class="h-9 w-auto" />`;document.querySelectorAll(".logo-marca").forEach(a=>{a.innerHTML=o})});export{q as a,A as b,k as c,B as d,n as e,f,L as g,S as l,b as p,$ as r,U as t,x as w};
