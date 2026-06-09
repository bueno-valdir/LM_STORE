const x={whatsapp:"5515998234551",pocketbaseUrl:"https://painel.lmstore.veraxlegalops.com.br"},g="/LM_STORE";function v(t){if(/^([a-z]+:)?\/\//i.test(t)||t.startsWith("#"))return t;const e=g.endsWith("/")?g.slice(0,-1):g,a=t.startsWith("/")?t:`/${t}`;return`${e}${a}`}const l=x.pocketbaseUrl.replace(/\/$/,""),q={maquiagem:"Maquiagem",skincare:"Skincare","kits-presentes":"Kits e Presentes"};function $(t){if(t===""||t===null||t===void 0)return null;const e=Number(t);return Number.isFinite(e)?e:null}function n(t){return(t||"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function S(t){return(t||"").replace(/<\s*br\s*\/?>/gi,`
`).replace(/<\/(p|div|li|h[1-6])>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/\n{3,}/g,`

`).trim()}function b(t){const a=(Array.isArray(t.imagens)?t.imagens:t.imagens?[t.imagens]:[]).map(o=>({src:`${l}/api/files/produtos/${t.id}/${o}`,alt:t.nome||"Produto"}));return{id:t.id,nome:t.nome||"",marca:t.marca||"",categoria:t.categoria||t.select||"",descricao:t.descricao||"",preco:$(t.preco),precoPromocional:$(t.preco_promocional),tom:t.tom||null,volume:t.volume||null,imagens:a.length?a:[{src:v("/images/products/placeholder-1.svg"),alt:t.nome||"Produto"}],disponivel:!!t.disponivel,destaque:!!t.destaque,promocao:!!t.promocao}}let i=null;function U(){return l?i||(i=(async()=>{const t=await fetch(`${l}/api/collections/produtos/records?perPage=200&sort=-created`,{cache:"no-store"});if(!t.ok)throw new Error("HTTP "+t.status);return((await t.json()).items||[]).map(b)})().catch(t=>{throw i=null,t}),i):Promise.resolve([])}async function L(t){if(!l||!t)return null;const e=await fetch(`${l}/api/collections/produtos/records/${encodeURIComponent(t)}`,{cache:"no-store"});return e.ok?b(await e.json()):null}function w(t){return q[t]||t||""}function h(t){return t==null?null:t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function y(t){return typeof t.precoPromocional=="number"&&t.precoPromocional>0?{atual:t.precoPromocional,de:t.preco,promo:!0}:{atual:t.preco,de:null,promo:!1}}function B(t){const e=[`Olá! Tenho interesse no produto: ${t.nome} (${t.id})`];t.tom&&e.push(`, tom ${t.tom}`);const{atual:a}=y(t),o=h(a);return o&&e.push(` - ${o}`),`https://wa.me/${x.whatsapp}?text=${encodeURIComponent(e.join(""))}`}function T(t,e,a,o){if(!o.length)return"";const u=o.map(s=>`<div class="min-w-[46%] snap-start sm:min-w-[31%] lg:min-w-[23%]">${A(s)}</div>`).join(""),r=(s,d,f)=>`<button type="button" class="carrossel-${s} grid h-9 w-9 place-items-center rounded-full border border-fundo-borda text-texto transition-colors hover:border-marca hover:text-marca" aria-label="${d}">${f}</button>`;return`
  <section class="container-loja py-8">
    <div class="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 class="font-titulo text-2xl font-bold text-texto">${n(t)}</h2>
        ${e?`<p class="text-sm text-texto-suave">${n(e)}</p>`:""}
      </div>
      <div class="flex items-center gap-2">
        <a href="${n(a)}" class="hidden text-sm font-medium text-marca-escuro hover:underline sm:inline">Ver tudo</a>
        ${r("prev","Anterior","&lsaquo;")}
        ${r("next","Próximo","&rsaquo;")}
      </div>
    </div>
    <div class="carrossel-track flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2">${u}</div>
  </section>`}function A(t){const{atual:e,de:a,promo:o}=y(t),u=h(e),r=h(a),s=!t.disponivel,d=t.imagens[0],f=`
    <div class="absolute left-2 top-2 flex flex-col gap-1">
      ${o?'<span class="etiqueta bg-marca text-white">Promoção</span>':""}
      ${s?'<span class="etiqueta bg-preto/80 text-white">Esgotado</span>':""}
    </div>`,k=u?`<div class="flex items-baseline gap-2">
           <span class="font-titulo text-base font-bold text-marca">${u}</span>
           ${o&&r?`<span class="text-xs text-texto-suave line-through">${r}</span>`:""}
         </div>`:'<span class="text-sm font-medium text-texto-suave">Consultar no WhatsApp</span>';return`
  <a href="${v("/produto")}?id=${encodeURIComponent(t.id)}"
     class="group flex flex-col overflow-hidden rounded-marca border border-fundo-borda bg-fundo shadow-card transition-colors hover:border-marca">
    <div class="relative aspect-square overflow-hidden bg-fundo-claro">
      <img src="${n(d.src)}" alt="${n(d.alt)}" width="600" height="600" loading="lazy" decoding="async"
           class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ${f}
    </div>
    <div class="flex flex-1 flex-col gap-1 p-3">
      <span class="text-xs uppercase tracking-wide text-texto-suave">${n(t.marca)} &middot; ${n(w(t.categoria))}</span>
      <h3 class="font-titulo text-sm font-semibold leading-snug text-texto">${n(t.nome)}</h3>
      <div class="mt-auto pt-2">${k}</div>
    </div>
  </a>`}const c=x.pocketbaseUrl.replace(/\/$/,"");function P(t,e,a){return a?`${c}/api/files/${t}/${e}/${a}`:""}let m=null;function j(){const t={barraAviso:null,logoUrl:null};return c?m||(m=(async()=>{try{const e=await fetch(`${c}/api/collections/configuracao/records?perPage=1`,{cache:"no-store"});if(!e.ok)return t;const o=((await e.json()).items||[])[0];return o?{barraAviso:o.barra_aviso?String(o.barra_aviso):null,logoUrl:o.logo?P("configuracao",o.id,o.logo):null}:t}catch{return t}})(),m):Promise.resolve(t)}async function C(){if(!c)return[];try{const t=encodeURIComponent("ativo = true"),e=await fetch(`${c}/api/collections/banners/records?perPage=20&sort=ordem&filter=${t}`,{cache:"no-store"});return e.ok?((await e.json()).items||[]).map(o=>({imagem:o.imagem?P("banners",o.id,o.imagem):"",titulo:o.titulo?String(o.titulo):"",subtitulo:o.subtitulo?String(o.subtitulo):"",link:o.link?String(o.link):""})).filter(o=>o.imagem):[]}catch{return[]}}j().then(t=>{if(t.barraAviso){const e=document.getElementById("barra-aviso");e&&(e.textContent=t.barraAviso)}});const p=document.getElementById("menu-categorias");p&&U().then(t=>{const e=Array.from(new Set(t.map(a=>a.categoria).filter(Boolean)));if(!e.length){p.innerHTML='<p class="px-3 py-2 text-xs text-white/50">Em breve</p>';return}p.innerHTML=e.map(a=>`<a href="${v("/catalogo")}?cat=${encodeURIComponent(a)}" class="block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-marca-claro">${n(w(a))}</a>`).join("")}).catch(()=>{p.innerHTML='<p class="px-3 py-2 text-xs text-white/50">Indisponível</p>'});j().then(t=>{if(!t.logoUrl)return;const e=`<img src="${t.logoUrl}" alt="Lojinha da Miih" class="h-14 w-auto sm:h-16" /><span class="font-manuscrita text-2xl leading-none text-white">Lojinha da Miih</span>`;document.querySelectorAll(".logo-marca").forEach(o=>{o.innerHTML=e});const a=document.querySelector("link[rel='icon']");a&&a.setAttribute("href",t.logoUrl)});export{A as a,L as b,U as c,T as d,n as e,h as f,C as g,B as l,y as p,w as r,x as s,S as t,v as w};
