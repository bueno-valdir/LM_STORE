import{c as L,d as u,w as m,g as E,e as l,s as B}from"./hoisted.DSIPyw15.js";const g=document.getElementById("carrosseis"),h=document.getElementById("carrosseis-carregando"),f=document.getElementById("carrosseis-vazio"),p=document.getElementById("faixa-promo");L().then(e=>{if(h?.classList.add("hidden"),!e.length){f?.classList.remove("hidden");return}p&&e.some(o=>o.promocao)&&p.classList.remove("hidden");const t=e.filter(o=>o.destaque),r=e.filter(o=>o.promocao);let a=u("Destaques","Queridinhos selecionados pra você",m("/catalogo"),t.length?t:e);r.length&&(a+=u("Promoções","Aproveite enquanto dura",m("/catalogo#promocoes"),r)),g.innerHTML=a,g.querySelectorAll(".carrossel-track").forEach(o=>{const n=o.closest("section"),c=()=>o.clientWidth*.8;n?.querySelector(".carrossel-next")?.addEventListener("click",()=>o.scrollBy({left:c(),behavior:"smooth"})),n?.querySelector(".carrossel-prev")?.addEventListener("click",()=>o.scrollBy({left:-c(),behavior:"smooth"}))})}).catch(e=>{console.error("[home] erro ao carregar produtos:",e),h?.classList.add("hidden"),f?.classList.remove("hidden")});const w=document.getElementById("hero-slides"),$=document.getElementById("hero-dots");let s=0,i;function I(){const e=Array.from(w.querySelectorAll(".hero-slide")),t=Array.from($.querySelectorAll(".hero-dot"));s=0,window.clearInterval(i);function r(a){s=(a+e.length)%e.length,e.forEach((o,n)=>o.classList.toggle("hidden",n!==s)),t.forEach((o,n)=>o.setAttribute("aria-current",n===s?"true":"false"))}e.length>1&&(i=window.setInterval(()=>r(s+1),6e3)),t.forEach(a=>{a.addEventListener("click",()=>{r(Number(a.dataset.dot)),window.clearInterval(i),e.length>1&&(i=window.setInterval(()=>r(s+1),6e3))})})}I();E().then(e=>{e.length&&(w.innerHTML=e.map((t,r)=>{const a=`<img src="${l(t.imagem)}" alt="${l(t.titulo||"Banner")}" class="w-full rounded-marca object-cover" />`,o=t.link?`<a href="${l(t.link)}">${a}</a>`:a;return`<div class="hero-slide${r!==0?" hidden":""}" data-slide="${r}">${o}</div>`}).join(""),$.innerHTML=e.length>1?e.map((t,r)=>`<button type="button" class="hero-dot h-2.5 w-2.5 rounded-full bg-fundo-borda aria-[current=true]:w-6 aria-[current=true]:bg-marca" data-dot="${r}" aria-current="${r===0?"true":"false"}" aria-label="Ir para o banner ${r+1}"></button>`).join(""):"",I())}).catch(()=>{});function q(e){const t=String(e||"").trim();if(!t)return"";const r=t.match(/[?&]v=([\w-]{6,})/)||t.match(/youtu\.be\/([\w-]{6,})/)||t.match(/youtube\.com\/shorts\/([\w-]{6,})/)||t.match(/youtube\.com\/embed\/([\w-]{6,})/);if(r)return`https://www.youtube.com/embed/${r[1]}`;const a=t.match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/);return a?`https://www.instagram.com/${a[1]}/${a[2]}/embed`:""}async function x(e=12){const t=B.pocketbaseUrl;try{const r=`${t}/api/collections/videos/records?perPage=${e}&sort=ordem&filter=${encodeURIComponent("ativo=true")}`,a=await fetch(r,{cache:"no-store"});if(!a.ok)return[];const o=await a.json();return(Array.isArray(o?.items)?o.items:[]).map(c=>({titulo:String(c.titulo||""),embedUrl:q(c.url)})).filter(c=>c.embedUrl)}catch{return[]}}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const S=document.getElementById("vid-sec"),b=document.getElementById("vid-grid");x(12).then(e=>{!b||!e.length||(b.innerHTML=e.map(t=>`
          <figure class="overflow-hidden rounded-marca border border-fundo-borda bg-fundo-claro">
            <div class="aspect-video">
              <iframe
                src="${d(t.embedUrl)}"
                title="${d(t.titulo||"Vídeo da Lojinha da Miih")}"
                loading="lazy"
                class="h-full w-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            ${t.titulo?`<figcaption class="p-3 text-sm text-texto-suave">${d(t.titulo)}</figcaption>`:""}
          </figure>`).join(""),S?.classList.remove("hidden"))}).catch(e=>console.error("[videos] erro ao carregar:",e));async function j(e=8){return[]}function y(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const k=document.getElementById("ig-sec"),v=document.getElementById("ig-grid");j(12).then(e=>{!v||!e.length||(v.innerHTML=e.map(t=>`
          <a
            href="${y(t.permalink)}"
            target="_blank"
            rel="noopener"
            class="group relative block aspect-square overflow-hidden rounded-marca border border-fundo-borda bg-fundo-claro"
            aria-label="Ver publicação no Instagram"
          >
            <img
              src="${y(t.img)}"
              alt="Publicação do Instagram da Lojinha da Miih"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            ${t.video?'<span class="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">vídeo</span>':""}
          </a>`).join(""),k?.classList.remove("hidden"))}).catch(e=>console.error("[instagram] erro ao carregar:",e));
