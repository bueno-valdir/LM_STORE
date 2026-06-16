import{f as B,p as L,g,e as a,h as j,t as A,l as p}from"./hoisted.BHIIPjob.js";const x=document.getElementById("detalhe"),v=document.getElementById("carregando"),h=document.getElementById("nao-encontrado"),f=document.getElementById("trilha-nome");function I(t){const{atual:o,de:b,promo:r}=L(t),l=g(o),i=g(b),n=!t.disponivel,m=t.imagens[0];f&&(f.textContent=t.nome),document.title=`${t.nome} | Lojinha da Miih`;const $=t.imagens.length>1?`<div class="mt-3 grid grid-cols-4 gap-2">${t.imagens.map((e,d)=>`<button type="button" class="miniatura overflow-hidden rounded-lg border border-fundo-borda bg-fundo-claro focus-visible:border-marca" data-src="${a(e.src)}" data-alt="${a(e.alt)}" aria-label="Ver imagem ${d+1}"><img src="${a(e.src)}" alt="${a(e.alt)}" width="160" height="160" loading="lazy" decoding="async" class="aspect-square w-full object-cover" /></button>`).join("")}</div>`:"",y=l?`<div class="flex items-baseline gap-3">
           <span class="font-titulo text-3xl font-bold text-marca">${l}</span>
           ${r&&i?`<span class="text-lg text-texto-suave line-through">${i}</span>`:""}
         </div>`:'<span class="text-lg font-medium text-texto-suave">Consulte o valor no WhatsApp</span>',w=[t.volume?`<div class="flex gap-2"><dt class="font-semibold text-texto">Volume:</dt><dd>${a(t.volume)}</dd></div>`:""].join(""),E=t.tons>=1?`<div class="mt-5">
             <label for="tom-select" class="block text-sm font-semibold text-texto">Escolha o tom</label>
             <select id="tom-select" class="mt-1 w-full max-w-xs rounded-marca border border-fundo-borda bg-fundo px-3 py-2 text-sm text-texto focus-visible:border-marca">
               ${Array.from({length:t.tons},(e,d)=>d+1).map(e=>`<option value="${e}">Tom ${e}</option>`).join("")}
             </select>
           </div>`:"";x.innerHTML=`
      <div class="grid gap-8 md:grid-cols-2">
        <section>
          <div class="overflow-hidden rounded-marca border border-fundo-borda bg-fundo-claro">
            <img id="imagem-principal" src="${a(m.src)}" alt="${a(m.alt)}" width="800" height="800" loading="eager" decoding="async" class="aspect-square w-full object-cover" />
          </div>
          ${$}
        </section>

        <section>
          <span class="text-xs uppercase tracking-wide text-texto-suave">${a(t.marca)} &middot; ${a(j(t.categoria))}</span>
          <h1 class="mt-1 font-titulo text-3xl font-bold text-texto">${a(t.nome)}</h1>

          <div class="mt-3 flex flex-wrap gap-2">
            ${r?'<span class="etiqueta bg-marca text-white">Promoção</span>':""}
            <span class="etiqueta ${n?"bg-fundo-claro text-texto-suave":"bg-marca/10 text-marca-escuro"}">${n?"Esgotado":"Em estoque"}</span>
          </div>

          <div class="mt-5">${y}</div>

          <dl class="mt-4 space-y-1 text-sm text-texto-suave">${w}</dl>

          ${E}

          <p class="mt-5 whitespace-pre-line leading-relaxed text-texto-suave">${a(A(t.descricao))}</p>

          <div class="mt-6">
            <a id="btn-wpp" href="${a(p(t,t.tons>=1?1:void 0))}" target="_blank" rel="noopener" class="btn-marca">
              ${n?"Avise-me / Pedir mesmo assim":"Pedir no WhatsApp"}
            </a>
            <p class="mt-2 text-xs text-texto-suave">Você será levada ao WhatsApp com a mensagem do produto já preenchida.</p>
          </div>
        </section>
      </div>`;const c=document.getElementById("tom-select"),u=document.getElementById("btn-wpp");c&&u&&c.addEventListener("change",()=>{u.href=p(t,Number(c.value))});const s=document.getElementById("imagem-principal");x.querySelectorAll(".miniatura").forEach(e=>{e.addEventListener("click",()=>{s&&(s.src=e.dataset.src??s.src,s.alt=e.dataset.alt??s.alt)})})}async function q(){const t=new URLSearchParams(location.search).get("id")??"";try{const o=t?await B(t):null;if(v?.classList.add("hidden"),!o){h?.classList.remove("hidden");return}I(o)}catch(o){console.error("[produto] erro ao carregar:",o),v?.classList.add("hidden"),h?.classList.remove("hidden")}}q();
