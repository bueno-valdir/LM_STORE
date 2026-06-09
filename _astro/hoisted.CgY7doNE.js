const $={whatsapp:"5515998234551",pocketbaseUrl:"https://painel.lmstore.veraxlegalops.com.br"},x="/LM_STORE";function b(t){if(/^([a-z]+:)?\/\//i.test(t)||t.startsWith("#"))return t;const e=x.endsWith("/")?x.slice(0,-1):x,a=t.startsWith("/")?t:`/${t}`;return`${e}${a}`}const m=$.pocketbaseUrl.replace(/\/$/,""),U={maquiagem:"Maquiagem",skincare:"Skincare","kits-presentes":"Kits e Presentes"};function y(t){if(t===""||t===null||t===void 0)return null;const e=Number(t);return Number.isFinite(e)?e:null}function n(t){return(t||"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function T(t){return(t||"").replace(/<\s*br\s*\/?>/gi,`
`).replace(/<\/(p|div|li|h[1-6])>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/\n{3,}/g,`

`).trim()}function P(t){const a=(Array.isArray(t.imagens)?t.imagens:t.imagens?[t.imagens]:[]).map(o=>({src:`${m}/api/files/produtos/${t.id}/${o}`,alt:t.nome||"Produto"}));return{id:t.id,nome:t.nome||"",marca:t.marca||"",categoria:t.categoria||t.select||"",descricao:t.descricao||"",preco:y(t.preco),precoPromocional:y(t.preco_promocional),tom:t.tom||null,volume:t.volume||null,imagens:a.length?a:[{src:b("/images/products/placeholder-1.svg"),alt:t.nome||"Produto"}],disponivel:!!t.disponivel,destaque:!!t.destaque,promocao:!!t.promocao}}let u=null;function B(){return m?u||(u=(async()=>{const t=await fetch(`${m}/api/collections/produtos/records?perPage=200&sort=-created`,{cache:"no-store"});if(!t.ok)throw new Error("HTTP "+t.status);return((await t.json()).items||[]).map(P)})().catch(t=>{throw u=null,t}),u):Promise.resolve([])}async function C(t){if(!m||!t)return null;const e=await fetch(`${m}/api/collections/produtos/records/${encodeURIComponent(t)}`,{cache:"no-store"});return e.ok?P(await e.json()):null}function j(t){return U[t]||t||""}function v(t){return t==null?null:t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function k(t){return typeof t.precoPromocional=="number"&&t.precoPromocional>0?{atual:t.precoPromocional,de:t.preco,promo:!0}:{atual:t.preco,de:null,promo:!1}}function M(t){const e=[`Olá! Tenho interesse no produto: ${t.nome} (${t.id})`];t.tom&&e.push(`, tom ${t.tom}`);const{atual:a}=k(t),o=v(a);return o&&e.push(` - ${o}`),`https://wa.me/${$.whatsapp}?text=${encodeURIComponent(e.join(""))}`}function H(t,e,a,o){if(!o.length)return"";const c=o.map(r=>`<div class="w-[42%] shrink-0 snap-start sm:w-[27%] md:w-[22%] lg:w-[18%]">${I(r,{compacto:!0})}</div>`).join(""),s=(r,i,l)=>`<button type="button" class="carrossel-${r} grid h-9 w-9 place-items-center rounded-full border border-fundo-borda text-texto transition-colors hover:border-marca hover:text-marca" aria-label="${i}">${l}</button>`;return`
  <section class="container-loja py-8">
    <div class="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 class="font-titulo text-2xl font-bold text-texto">${n(t)}</h2>
        ${e?`<p class="text-sm text-texto-suave">${n(e)}</p>`:""}
      </div>
      <div class="flex items-center gap-2">
        <a href="${n(a)}" class="hidden text-sm font-medium text-marca-escuro hover:underline sm:inline">Ver tudo</a>
        ${s("prev","Anterior","&lsaquo;")}
        ${s("next","Próximo","&rsaquo;")}
      </div>
    </div>
    <div class="carrossel-track flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2">${c}</div>
  </section>`}function I(t,e){const a=typeof e=="object"&&e!==null?!!e.compacto:!1,{atual:o,de:c,promo:s}=k(t),r=v(o),i=v(c),l=!t.disponivel,p=t.imagens[0],E=`
    <div class="absolute left-2 top-2 flex flex-col gap-1">
      ${s?'<span class="etiqueta bg-marca text-white">Promoção</span>':""}
      ${l?'<span class="etiqueta bg-preto/80 text-white">Esgotado</span>':""}
    </div>`,w=r?`<div class="flex items-baseline gap-1.5">
           <span class="font-titulo ${a?"text-sm":"text-base"} font-bold text-marca">${r}</span>
           ${s&&i?`<span class="text-xs text-texto-suave line-through">${i}</span>`:""}
         </div>`:`<span class="${a?"text-xs":"text-sm"} font-medium text-texto-suave">Consultar no WhatsApp</span>`,q=a?`<div class="flex flex-1 flex-col gap-0.5 p-2.5">
         <span class="truncate text-[10px] uppercase tracking-wide text-texto-suave">${n(t.marca)}</span>
         <h3 class="line-clamp-2 font-titulo text-xs font-semibold leading-snug text-texto">${n(t.nome)}</h3>
         <div class="mt-auto pt-1.5">${w}</div>
       </div>`:`<div class="flex flex-1 flex-col gap-1 p-3">
         <span class="text-xs uppercase tracking-wide text-texto-suave">${n(t.marca)} &middot; ${n(j(t.categoria))}</span>
         <h3 class="font-titulo text-sm font-semibold leading-snug text-texto">${n(t.nome)}</h3>
         <div class="mt-auto pt-2">${w}</div>
       </div>`;return`
  <a href="${b("/produto")}?id=${encodeURIComponent(t.id)}"
     class="group flex flex-col overflow-hidden rounded-marca border border-fundo-borda bg-fundo shadow-card transition-colors hover:border-marca">
    <div class="relative aspect-square overflow-hidden bg-fundo-claro">
      <img src="${n(p.src)}" alt="${n(p.alt)}" width="600" height="600" loading="lazy" decoding="async"
           class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ${E}
    </div>
    ${q}
  </a>`}const d=$.pocketbaseUrl.replace(/\/$/,"");function A(t,e,a){return a?`${d}/api/files/${t}/${e}/${a}`:""}let f=null;function S(){const t={barraAviso:null,logoUrl:null};return d?f||(f=(async()=>{try{const e=await fetch(`${d}/api/collections/configuracao/records?perPage=1`,{cache:"no-store"});if(!e.ok)return t;const o=((await e.json()).items||[])[0];return o?{barraAviso:o.barra_aviso?String(o.barra_aviso):null,logoUrl:o.logo?A("configuracao",o.id,o.logo):null}:t}catch{return t}})(),f):Promise.resolve(t)}async function R(){if(!d)return[];try{const t=encodeURIComponent("ativo = true"),e=await fetch(`${d}/api/collections/banners/records?perPage=20&sort=ordem&filter=${t}`,{cache:"no-store"});return e.ok?((await e.json()).items||[]).map(o=>({imagem:o.imagem?A("banners",o.id,o.imagem):"",titulo:o.titulo?String(o.titulo):"",subtitulo:o.subtitulo?String(o.subtitulo):"",link:o.link?String(o.link):""})).filter(o=>o.imagem):[]}catch{return[]}}S().then(t=>{if(t.barraAviso){const e=document.getElementById("barra-aviso");e&&(e.textContent=t.barraAviso)}});const g=document.getElementById("menu-categorias");g&&B().then(t=>{const e=Array.from(new Set(t.map(a=>a.categoria).filter(Boolean)));if(!e.length){g.innerHTML='<p class="px-3 py-2 text-xs text-white/50">Em breve</p>';return}g.innerHTML=e.map(a=>`<a href="${b("/catalogo")}?cat=${encodeURIComponent(a)}" class="block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-marca-claro">${n(j(a))}</a>`).join("")}).catch(()=>{g.innerHTML='<p class="px-3 py-2 text-xs text-white/50">Indisponível</p>'});const h=document.getElementById("trava-dev");if(h){const t=h.getAttribute("data-hash")||"",e="lm_acesso";if(localStorage.getItem(e)==="1")h.remove();else{document.documentElement.style.overflow="hidden";const a=document.getElementById("trava-form"),o=document.getElementById("trava-senha"),c=document.getElementById("trava-erro");async function s(r){const i=new TextEncoder().encode(r),l=await crypto.subtle.digest("SHA-256",i);return Array.from(new Uint8Array(l)).map(p=>p.toString(16).padStart(2,"0")).join("")}a?.addEventListener("submit",async r=>{r.preventDefault(),await s(o?.value||"")===t?(localStorage.setItem(e,"1"),document.documentElement.style.overflow="",h.remove()):(c?.classList.remove("hidden"),o&&(o.value=""))})}}S().then(t=>{if(!t.logoUrl)return;const e=`<img src="${t.logoUrl}" alt="Lojinha da Miih" class="h-14 w-auto sm:h-16" /><span class="font-manuscrita text-2xl leading-none text-white">Lojinha da Miih</span>`;document.querySelectorAll(".logo-marca").forEach(o=>{o.innerHTML=e});const a=document.querySelector("link[rel='icon']");a&&a.setAttribute("href",t.logoUrl)});export{I as a,C as b,B as c,H as d,n as e,v as f,R as g,M as l,k as p,j as r,$ as s,T as t,b as w};
