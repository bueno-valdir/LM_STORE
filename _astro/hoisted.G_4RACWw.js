const g={whatsapp:"5515998234551",pocketbaseUrl:"https://painel.lmstore.veraxlegalops.com.br"},p="/LM_STORE";function f(t){if(/^([a-z]+:)?\/\//i.test(t)||t.startsWith("#"))return t;const e=p.endsWith("/")?p.slice(0,-1):p,o=t.startsWith("/")?t:`/${t}`;return`${e}${o}`}const i=g.pocketbaseUrl.replace(/\/$/,""),w={maquiagem:"Maquiagem",skincare:"Skincare","kits-presentes":"Kits e Presentes"};function x(t){if(t===""||t===null||t===void 0)return null;const e=Number(t);return Number.isFinite(e)?e:null}function s(t){return(t||"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function h(t){const o=(Array.isArray(t.imagens)?t.imagens:t.imagens?[t.imagens]:[]).map(a=>({src:`${i}/api/files/produtos/${t.id}/${a}`,alt:t.nome||"Produto"}));return{id:t.id,nome:t.nome||"",marca:t.marca||"",categoria:t.categoria||t.select||"",descricao:t.descricao||"",preco:x(t.preco),precoPromocional:x(t.preco_promocional),tom:t.tom||null,volume:t.volume||null,imagens:o.length?o:[{src:f("/images/products/placeholder-1.svg"),alt:t.nome||"Produto"}],disponivel:!!t.disponivel,destaque:!!t.destaque,promocao:!!t.promocao}}async function y(){if(!i)return[];const t=await fetch(`${i}/api/collections/produtos/records?perPage=200&sort=-created`);if(!t.ok)throw new Error("HTTP "+t.status);return((await t.json()).items||[]).map(h)}async function q(t){if(!i||!t)return null;const e=await fetch(`${i}/api/collections/produtos/records/${encodeURIComponent(t)}`);return e.ok?h(await e.json()):null}function v(t){return w[t]||t||""}function m(t){return t==null?null:t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function $(t){return typeof t.precoPromocional=="number"&&t.precoPromocional>0?{atual:t.precoPromocional,de:t.preco,promo:!0}:{atual:t.preco,de:null,promo:!1}}function k(t){const e=[`Olá! Tenho interesse no produto: ${t.nome} (${t.id})`];t.tom&&e.push(`, tom ${t.tom}`);const{atual:o}=$(t),a=m(o);return a&&e.push(` - ${a}`),`https://wa.me/${g.whatsapp}?text=${encodeURIComponent(e.join(""))}`}function j(t,e,o,a){if(!a.length)return"";const c=a.map(r=>`<div class="min-w-[46%] snap-start sm:min-w-[31%] lg:min-w-[23%]">${P(r)}</div>`).join(""),n=(r,l,d)=>`<button type="button" class="carrossel-${r} grid h-9 w-9 place-items-center rounded-full border border-fundo-borda text-texto transition-colors hover:border-marca hover:text-marca" aria-label="${l}">${d}</button>`;return`
  <section class="container-loja py-8">
    <div class="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 class="font-titulo text-2xl font-bold text-texto">${s(t)}</h2>
        ${e?`<p class="text-sm text-texto-suave">${s(e)}</p>`:""}
      </div>
      <div class="flex items-center gap-2">
        <a href="${s(o)}" class="hidden text-sm font-medium text-marca-escuro hover:underline sm:inline">Ver tudo</a>
        ${n("prev","Anterior","&lsaquo;")}
        ${n("next","Próximo","&rsaquo;")}
      </div>
    </div>
    <div class="carrossel-track flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2">${c}</div>
  </section>`}function P(t){const{atual:e,de:o,promo:a}=$(t),c=m(e),n=m(o),r=!t.disponivel,l=t.imagens[0],d=`
    <div class="absolute left-2 top-2 flex flex-col gap-1">
      ${a?'<span class="etiqueta bg-marca text-white">Promoção</span>':""}
      ${r?'<span class="etiqueta bg-preto/80 text-white">Esgotado</span>':""}
    </div>`,b=c?`<div class="flex items-baseline gap-2">
           <span class="font-titulo text-base font-bold text-marca">${c}</span>
           ${a&&n?`<span class="text-xs text-texto-suave line-through">${n}</span>`:""}
         </div>`:'<span class="text-sm font-medium text-texto-suave">Consultar no WhatsApp</span>';return`
  <a href="${f("/produto")}?id=${encodeURIComponent(t.id)}"
     class="group flex flex-col overflow-hidden rounded-marca border border-fundo-borda bg-fundo shadow-card transition-colors hover:border-marca">
    <div class="relative aspect-square overflow-hidden bg-fundo-claro">
      <img src="${s(l.src)}" alt="${s(l.alt)}" width="600" height="600" loading="lazy" decoding="async"
           class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ${d}
    </div>
    <div class="flex flex-1 flex-col gap-1 p-3">
      <span class="text-xs uppercase tracking-wide text-texto-suave">${s(t.marca)} &middot; ${s(v(t.categoria))}</span>
      <h3 class="font-titulo text-sm font-semibold leading-snug text-texto">${s(t.nome)}</h3>
      <div class="mt-auto pt-2">${b}</div>
    </div>
  </a>`}const u=document.getElementById("menu-categorias");u&&y().then(t=>{const e=Array.from(new Set(t.map(o=>o.categoria).filter(Boolean)));if(!e.length){u.innerHTML='<p class="px-3 py-2 text-xs text-white/50">Em breve</p>';return}u.innerHTML=e.map(o=>`<a href="${f("/catalogo")}?cat=${encodeURIComponent(o)}" class="block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-marca-claro">${s(v(o))}</a>`).join("")}).catch(()=>{u.innerHTML='<p class="px-3 py-2 text-xs text-white/50">Indisponível</p>'});export{P as a,q as b,y as c,j as d,s as e,m as f,k as l,$ as p,v as r,f as w};
