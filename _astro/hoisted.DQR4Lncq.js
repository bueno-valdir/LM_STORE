import{b as $,p as y,f as l,e,r as w,l as E}from"./hoisted.G_4RACWw.js";const m=document.getElementById("detalhe"),u=document.getElementById("carregando"),g=document.getElementById("nao-encontrado"),p=document.getElementById("trilha-nome");function L(t){const{atual:s,de:x,promo:d}=y(t),c=l(s),r=l(x),n=!t.disponivel,i=t.imagens[0];p&&(p.textContent=t.nome),document.title=`${t.nome} | Lojinha da Miih`;const v=t.imagens.length>1?`<div class="mt-3 grid grid-cols-4 gap-2">${t.imagens.map((a,b)=>`<button type="button" class="miniatura overflow-hidden rounded-lg border border-fundo-borda bg-fundo-claro focus-visible:border-marca" data-src="${e(a.src)}" data-alt="${e(a.alt)}" aria-label="Ver imagem ${b+1}"><img src="${e(a.src)}" alt="${e(a.alt)}" width="160" height="160" loading="lazy" decoding="async" class="aspect-square w-full object-cover" /></button>`).join("")}</div>`:"",h=c?`<div class="flex items-baseline gap-3">
           <span class="font-titulo text-3xl font-bold text-marca">${c}</span>
           ${d&&r?`<span class="text-lg text-texto-suave line-through">${r}</span>`:""}
         </div>`:'<span class="text-lg font-medium text-texto-suave">Consulte o valor no WhatsApp</span>',f=[t.tom?`<div class="flex gap-2"><dt class="font-semibold text-texto">Tom:</dt><dd>${e(t.tom)}</dd></div>`:"",t.volume?`<div class="flex gap-2"><dt class="font-semibold text-texto">Volume:</dt><dd>${e(t.volume)}</dd></div>`:""].join("");m.innerHTML=`
      <div class="grid gap-8 md:grid-cols-2">
        <section>
          <div class="overflow-hidden rounded-marca border border-fundo-borda bg-fundo-claro">
            <img id="imagem-principal" src="${e(i.src)}" alt="${e(i.alt)}" width="800" height="800" loading="eager" decoding="async" class="aspect-square w-full object-cover" />
          </div>
          ${v}
        </section>

        <section>
          <span class="text-xs uppercase tracking-wide text-texto-suave">${e(t.marca)} &middot; ${e(w(t.categoria))}</span>
          <h1 class="mt-1 font-titulo text-3xl font-bold text-texto">${e(t.nome)}</h1>

          <div class="mt-3 flex flex-wrap gap-2">
            ${d?'<span class="etiqueta bg-marca text-white">Promoção</span>':""}
            <span class="etiqueta ${n?"bg-fundo-claro text-texto-suave":"bg-marca/10 text-marca-escuro"}">${n?"Esgotado":"Em estoque"}</span>
          </div>

          <div class="mt-5">${h}</div>

          <dl class="mt-4 space-y-1 text-sm text-texto-suave">${f}</dl>

          <p class="mt-5 leading-relaxed text-texto-suave">${e(t.descricao)}</p>

          <div class="mt-6">
            <a href="${e(E(t))}" target="_blank" rel="noopener" class="btn-marca">
              ${n?"Avise-me / Pedir mesmo assim":"Pedir no WhatsApp"}
            </a>
            <p class="mt-2 text-xs text-texto-suave">Você será levada ao WhatsApp com a mensagem do produto já preenchida.</p>
          </div>
        </section>
      </div>`;const o=document.getElementById("imagem-principal");m.querySelectorAll(".miniatura").forEach(a=>{a.addEventListener("click",()=>{o&&(o.src=a.dataset.src??o.src,o.alt=a.dataset.alt??o.alt)})})}async function j(){const t=new URLSearchParams(location.search).get("id")??"";try{const s=t?await $(t):null;if(u?.classList.add("hidden"),!s){g?.classList.remove("hidden");return}L(s)}catch(s){console.error("[produto] erro ao carregar:",s),u?.classList.add("hidden"),g?.classList.remove("hidden")}}j();
