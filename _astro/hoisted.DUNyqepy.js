import{f as j,p as A,g as v,e as a,h as I,t as k,l as f}from"./hoisted.DmxdpPkB.js";const h=document.getElementById("detalhe"),b=document.getElementById("carregando"),$=document.getElementById("nao-encontrado"),y=document.getElementById("trilha-nome");function P(t){const{atual:o,de:w,promo:r}=A(t),l=v(o),i=v(w),c=!t.disponivel,m=t.imagens[0];y&&(y.textContent=t.nome),document.title=`${t.nome} | Lojinha da Miih`;const E=t.imagens.length>1?`<div class="mt-3 grid grid-cols-4 gap-2">${t.imagens.map((e,s)=>`<button type="button" class="miniatura overflow-hidden rounded-lg border border-fundo-borda bg-fundo-claro focus-visible:border-marca" data-src="${a(e.src)}" data-alt="${a(e.alt)}" aria-label="Ver imagem ${s+1}"><img src="${a(e.src)}" alt="${a(e.alt)}" width="160" height="160" loading="lazy" decoding="async" class="aspect-square w-full object-cover" /></button>`).join("")}</div>`:"",L=l?`<div class="flex items-baseline gap-3">
           <span class="font-titulo text-3xl font-bold text-marca">${l}</span>
           ${r&&i?`<span class="text-lg text-texto-suave line-through">${i}</span>`:""}
         </div>`:'<span class="text-lg font-medium text-texto-suave">Consulte o valor no WhatsApp</span>',B=[t.volume?`<div class="flex gap-2"><dt class="font-semibold text-texto">Volume:</dt><dd>${a(t.volume)}</dd></div>`:""].join(""),u=e=>!t.estoqueTons||(t.estoqueTons[e-1]??0)>0,g=Array.from({length:t.tons},(e,s)=>s+1),p=g.find(u)??1,q=t.tons>=1?`<div class="mt-5">
             <label for="tom-select" class="block text-sm font-semibold text-texto">Escolha o tom</label>
             <select id="tom-select" class="mt-1 w-full max-w-xs rounded-marca border border-fundo-borda bg-fundo px-3 py-2 text-sm text-texto focus-visible:border-marca">
               ${g.map(e=>{const s=u(e);return`<option value="${e}"${e===p?" selected":""}${s?"":" disabled"}>Tom ${e}${s?"":" (esgotado)"}</option>`}).join("")}
             </select>
           </div>`:"";h.innerHTML=`
      <div class="grid gap-8 md:grid-cols-2">
        <section>
          <div class="overflow-hidden rounded-marca border border-fundo-borda bg-fundo-claro">
            <img id="imagem-principal" src="${a(m.src)}" alt="${a(m.alt)}" width="800" height="800" loading="eager" decoding="async" class="aspect-square w-full object-cover" />
          </div>
          ${E}
        </section>

        <section>
          <span class="text-xs uppercase tracking-wide text-texto-suave">${a(t.marca)} &middot; ${a(I(t.categoria))}</span>
          <h1 class="mt-1 font-titulo text-3xl font-bold text-texto">${a(t.nome)}</h1>

          <div class="mt-3 flex flex-wrap gap-2">
            ${r?'<span class="etiqueta bg-marca text-white">Promoção</span>':""}
            <span class="etiqueta ${c?"bg-fundo-claro text-texto-suave":"bg-marca/10 text-marca-escuro"}">${c?"Esgotado":"Em estoque"}</span>
          </div>

          <div class="mt-5">${L}</div>

          <dl class="mt-4 space-y-1 text-sm text-texto-suave">${B}</dl>

          ${q}

          <p class="mt-5 whitespace-pre-line leading-relaxed text-texto-suave">${a(k(t.descricao))}</p>

          <div class="mt-6">
            <a id="btn-wpp" href="${a(f(t,t.tons>=1?p:void 0))}" target="_blank" rel="noopener" class="btn-marca">
              ${c?"Avise-me / Pedir mesmo assim":"Pedir no WhatsApp"}
            </a>
            <p class="mt-2 text-xs text-texto-suave">Você será levada ao WhatsApp com a mensagem do produto já preenchida.</p>
          </div>
        </section>
      </div>`;const d=document.getElementById("tom-select"),x=document.getElementById("btn-wpp");d&&x&&d.addEventListener("change",()=>{x.href=f(t,Number(d.value))});const n=document.getElementById("imagem-principal");h.querySelectorAll(".miniatura").forEach(e=>{e.addEventListener("click",()=>{n&&(n.src=e.dataset.src??n.src,n.alt=e.dataset.alt??n.alt)})})}async function T(){const t=new URLSearchParams(location.search).get("id")??"";try{const o=t?await j(t):null;if(b?.classList.add("hidden"),!o){$?.classList.remove("hidden");return}P(o)}catch(o){console.error("[produto] erro ao carregar:",o),b?.classList.add("hidden"),$?.classList.remove("hidden")}}T();
