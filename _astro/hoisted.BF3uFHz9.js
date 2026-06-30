import{f as I,p as P,g as h,e as a,h as k,t as T,l as $}from"./hoisted.43gIB-1P.js";const y=document.getElementById("detalhe"),w=document.getElementById("carregando"),E=document.getElementById("nao-encontrado"),L=document.getElementById("trilha-nome");function W(t){const{atual:s,de:B,promo:l}=P(t),m=h(s),u=h(B),r=!t.disponivel,g=t.imagens[0];L&&(L.textContent=t.nome),document.title=`${t.nome} | Lojinha da Miih`;const C=t.imagens.length>1?`<div class="mt-3 grid grid-cols-4 gap-2">${t.imagens.map((e,o)=>`<button type="button" class="miniatura overflow-hidden rounded-lg border border-fundo-borda bg-fundo-claro focus-visible:border-marca" data-src="${a(e.src)}" data-alt="${a(e.alt)}" aria-label="Ver imagem ${o+1}"><img src="${a(e.src)}" alt="${a(e.alt)}" width="160" height="160" loading="lazy" decoding="async" class="aspect-square w-full object-cover" /></button>`).join("")}</div>`:"",q=m?`<div class="flex items-baseline gap-3">
           <span class="font-titulo text-3xl font-bold text-marca">${m}</span>
           ${l&&u?`<span class="text-lg text-texto-suave line-through">${u}</span>`:""}
         </div>`:'<span class="text-lg font-medium text-texto-suave">Consulte o valor no WhatsApp</span>',c=e=>typeof e=="number"&&e>0,A=c(t.alturaCm)&&c(t.larguraCm)&&c(t.comprimentoCm)?`${t.alturaCm} × ${t.larguraCm} × ${t.comprimentoCm} cm`:"",d=(e,o)=>o?`<div class="flex gap-2"><dt class="font-semibold text-texto">${e}:</dt><dd>${a(o)}</dd></div>`:"",p=[d("Volume",t.volume??""),d("Peso",c(t.pesoG)?`${t.pesoG} g`:""),d("Dimensões",A)].join(""),x=e=>!t.estoqueTons||(t.estoqueTons[e-1]??0)>0,v=Array.from({length:t.tons},(e,o)=>o+1),b=v.find(x)??1,j=t.tons>=1?`<div class="mt-5">
             <label for="tom-select" class="block text-sm font-semibold text-texto">Escolha o tom</label>
             <select id="tom-select" class="mt-1 w-full max-w-xs rounded-marca border border-fundo-borda bg-fundo px-3 py-2 text-sm text-texto focus-visible:border-marca">
               ${v.map(e=>{const o=x(e);return`<option value="${e}"${e===b?" selected":""}${o?"":" disabled"}>Tom ${e}${o?"":" (esgotado)"}</option>`}).join("")}
             </select>
           </div>`:"";y.innerHTML=`
      <div class="grid gap-8 md:grid-cols-2">
        <section>
          <div class="overflow-hidden rounded-marca border border-fundo-borda bg-fundo-claro">
            <img id="imagem-principal" src="${a(g.src)}" alt="${a(g.alt)}" width="800" height="800" loading="eager" decoding="async" class="aspect-square w-full object-cover" />
          </div>
          ${C}
        </section>

        <section>
          <span class="text-xs uppercase tracking-wide text-texto-suave">${a(t.marca)} &middot; ${a(k(t.categoria))}</span>
          <h1 class="mt-1 font-titulo text-3xl font-bold text-texto">${a(t.nome)}</h1>

          <div class="mt-3 flex flex-wrap gap-2">
            ${l?'<span class="etiqueta bg-marca text-white">Promoção</span>':""}
            <span class="etiqueta ${r?"bg-fundo-claro text-texto-suave":"bg-marca/10 text-marca-escuro"}">${r?"Esgotado":"Em estoque"}</span>
          </div>

          <div class="mt-5">${q}</div>

          ${p?`<dl class="mt-4 space-y-1 text-sm text-texto-suave">${p}</dl>`:""}

          ${j}

          <p class="mt-5 whitespace-pre-line leading-relaxed text-texto-suave">${a(T(t.descricao))}</p>

          <div class="mt-6">
            <a id="btn-wpp" href="${a($(t,t.tons>=1?b:void 0))}" target="_blank" rel="noopener" class="btn-marca">
              ${r?"Avise-me / Pedir mesmo assim":"Pedir no WhatsApp"}
            </a>
            <p class="mt-2 text-xs text-texto-suave">Você será levada ao WhatsApp com a mensagem do produto já preenchida.</p>
          </div>
        </section>
      </div>`;const i=document.getElementById("tom-select"),f=document.getElementById("btn-wpp");i&&f&&i.addEventListener("change",()=>{f.href=$(t,Number(i.value))});const n=document.getElementById("imagem-principal");y.querySelectorAll(".miniatura").forEach(e=>{e.addEventListener("click",()=>{n&&(n.src=e.dataset.src??n.src,n.alt=e.dataset.alt??n.alt)})})}async function S(){const t=new URLSearchParams(location.search).get("id")??"";try{const s=t?await I(t):null;if(w?.classList.add("hidden"),!s){E?.classList.remove("hidden");return}W(s)}catch(s){console.error("[produto] erro ao carregar:",s),w?.classList.add("hidden"),E?.classList.remove("hidden")}}S();
