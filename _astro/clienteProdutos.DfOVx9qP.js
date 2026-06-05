const d={whatsapp:"5515998234551",pocketbaseUrl:"https://painel.lmstore.veraxlegalops.com.br"},r="/LM_STORE";function m(t){if(/^([a-z]+:)?\/\//i.test(t)||t.startsWith("#"))return t;const o=r.endsWith("/")?r.slice(0,-1):r,e=t.startsWith("/")?t:`/${t}`;return`${o}${e}`}const n=d.pocketbaseUrl.replace(/\/$/,""),v={maquiagem:"Maquiagem",skincare:"Skincare","kits-presentes":"Kits e Presentes"};function p(t){if(t===""||t===null||t===void 0)return null;const o=Number(t);return Number.isFinite(o)?o:null}function s(t){return(t||"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function f(t){const e=(Array.isArray(t.imagens)?t.imagens:t.imagens?[t.imagens]:[]).map(a=>({src:`${n}/api/files/produtos/${t.id}/${a}`,alt:t.nome||"Produto"}));return{id:t.id,nome:t.nome||"",marca:t.marca||"",categoria:t.categoria||t.select||"",descricao:t.descricao||"",preco:p(t.preco),precoPromocional:p(t.preco_promocional),tom:t.tom||null,volume:t.volume||null,imagens:e.length?e:[{src:m("/images/products/placeholder-1.svg"),alt:t.nome||"Produto"}],disponivel:!!t.disponivel,destaque:!!t.destaque,promocao:!!t.promocao}}async function w(){if(!n)return[];const t=await fetch(`${n}/api/collections/produtos/records?perPage=200&sort=-created`);if(!t.ok)throw new Error("HTTP "+t.status);return((await t.json()).items||[]).map(f)}async function P(t){if(!n||!t)return null;const o=await fetch(`${n}/api/collections/produtos/records/${encodeURIComponent(t)}`);return o.ok?f(await o.json()):null}function b(t){return v[t]||t||""}function i(t){return t==null?null:t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function g(t){return typeof t.precoPromocional=="number"&&t.precoPromocional>0?{atual:t.precoPromocional,de:t.preco,promo:!0}:{atual:t.preco,de:null,promo:!1}}function q(t){const o=[`Olá! Tenho interesse no produto: ${t.nome} (${t.id})`];t.tom&&o.push(`, tom ${t.tom}`);const{atual:e}=g(t),a=i(e);return a&&o.push(` - ${a}`),`https://wa.me/${d.whatsapp}?text=${encodeURIComponent(o.join(""))}`}function y(t){const{atual:o,de:e,promo:a}=g(t),c=i(o),l=i(e),h=!t.disponivel,u=t.imagens[0],$=`
    <div class="absolute left-2 top-2 flex flex-col gap-1">
      ${a?'<span class="etiqueta bg-marca text-white">Promoção</span>':""}
      ${h?'<span class="etiqueta bg-preto/80 text-white">Esgotado</span>':""}
    </div>`,x=c?`<div class="flex items-baseline gap-2">
           <span class="font-titulo text-base font-bold text-marca">${c}</span>
           ${a&&l?`<span class="text-xs text-texto-suave line-through">${l}</span>`:""}
         </div>`:'<span class="text-sm font-medium text-texto-suave">Consultar no WhatsApp</span>';return`
  <a href="${m("/produto")}?id=${encodeURIComponent(t.id)}"
     class="group flex flex-col overflow-hidden rounded-marca border border-fundo-borda bg-fundo shadow-card transition-colors hover:border-marca">
    <div class="relative aspect-square overflow-hidden bg-fundo-claro">
      <img src="${s(u.src)}" alt="${s(u.alt)}" width="600" height="600" loading="lazy" decoding="async"
           class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ${$}
    </div>
    <div class="flex flex-1 flex-col gap-1 p-3">
      <span class="text-xs uppercase tracking-wide text-texto-suave">${s(t.marca)} &middot; ${s(b(t.categoria))}</span>
      <h3 class="font-titulo text-sm font-semibold leading-snug text-texto">${s(t.nome)}</h3>
      <div class="mt-auto pt-2">${x}</div>
    </div>
  </a>`}export{y as a,P as b,w as c,s as e,i as f,q as l,g as p,b as r};
