import{a as L,i as m,w as g,j as B,e as l,s as u}from"./hoisted.43gIB-1P.js";const h=document.getElementById("carrosseis"),f=document.getElementById("carrosseis-carregando"),p=document.getElementById("carrosseis-vazio"),b=document.getElementById("faixa-promo");L().then(e=>{if(f?.classList.add("hidden"),!e.length){p?.classList.remove("hidden");return}b&&e.some(a=>a.promocao)&&b.classList.remove("hidden");const r=e.filter(a=>a.destaque),t=e.filter(a=>a.promocao);let o=m("Destaques","Queridinhos selecionados pra você",g("/catalogo"),r.length?r:e);t.length&&(o+=m("Promoções","Aproveite enquanto dura",g("/catalogo#promocoes"),t)),h.innerHTML=o,h.querySelectorAll(".carrossel-track").forEach(a=>{const n=a.closest("section"),s=()=>a.clientWidth*.8;n?.querySelector(".carrossel-next")?.addEventListener("click",()=>a.scrollBy({left:s(),behavior:"smooth"})),n?.querySelector(".carrossel-prev")?.addEventListener("click",()=>a.scrollBy({left:-s(),behavior:"smooth"}))})}).catch(e=>{console.error("[home] erro ao carregar produtos:",e),f?.classList.add("hidden"),p?.classList.remove("hidden")});const $=document.getElementById("hero-slides"),I=document.getElementById("hero-dots");let c=0,i;function E(){const e=Array.from($.querySelectorAll(".hero-slide")),r=Array.from(I.querySelectorAll(".hero-dot"));c=0,window.clearInterval(i);function t(o){c=(o+e.length)%e.length,e.forEach((a,n)=>a.classList.toggle("hidden",n!==c)),r.forEach((a,n)=>a.setAttribute("aria-current",n===c?"true":"false"))}e.length>1&&(i=window.setInterval(()=>t(c+1),6e3)),r.forEach(o=>{o.addEventListener("click",()=>{t(Number(o.dataset.dot)),window.clearInterval(i),e.length>1&&(i=window.setInterval(()=>t(c+1),6e3))})})}E();B().then(e=>{e.length&&($.innerHTML=e.map((r,t)=>{const o=`<img src="${l(r.imagem)}" alt="${l(r.titulo||"Banner")}" class="w-full rounded-marca object-cover" />`,a=r.link?`<a href="${l(r.link)}">${o}</a>`:o;return`<div class="hero-slide${t!==0?" hidden":""}" data-slide="${t}">${a}</div>`}).join(""),I.innerHTML=e.length>1?e.map((r,t)=>`<button type="button" class="hero-dot h-2.5 w-2.5 rounded-full bg-fundo-borda aria-[current=true]:w-6 aria-[current=true]:bg-marca" data-dot="${t}" aria-current="${t===0?"true":"false"}" aria-label="Ir para o banner ${t+1}"></button>`).join(""):"",E())}).catch(()=>{});function k(e){const r=String(e||"").trim();if(!r)return"";const t=r.match(/[?&]v=([\w-]{6,})/)||r.match(/youtu\.be\/([\w-]{6,})/)||r.match(/youtube\.com\/shorts\/([\w-]{6,})/)||r.match(/youtube\.com\/embed\/([\w-]{6,})/);if(t)return`https://www.youtube.com/embed/${t[1]}`;const o=r.match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/);return o?`https://www.instagram.com/${o[1]}/${o[2]}/embed`:""}async function q(e=12){const r=u.pocketbaseUrl;try{const t=`${r}/api/collections/videos/records?perPage=${e}&sort=ordem&filter=${encodeURIComponent("ativo=true")}`,o=await fetch(t,{cache:"no-store"});if(!o.ok)return[];const a=await o.json();return(Array.isArray(a?.items)?a.items:[]).map(s=>({titulo:String(s.titulo||""),embedUrl:k(s.url)})).filter(s=>s.embedUrl)}catch{return[]}}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const j=document.getElementById("vid-sec"),y=document.getElementById("vid-grid");q(12).then(e=>{!y||!e.length||(y.innerHTML=e.map(r=>`
          <figure class="overflow-hidden rounded-marca border border-fundo-borda bg-fundo-claro">
            <div class="aspect-video">
              <iframe
                src="${d(r.embedUrl)}"
                title="${d(r.titulo||"Vídeo da Lojinha da Miih")}"
                loading="lazy"
                class="h-full w-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            ${r.titulo?`<figcaption class="p-3 text-sm text-texto-suave">${d(r.titulo)}</figcaption>`:""}
          </figure>`).join(""),j?.classList.remove("hidden"))}).catch(e=>console.error("[videos] erro ao carregar:",e));async function A(e=8){const r=u.beholdFeedId;try{const t=await fetch(`https://feeds.behold.so/${r}`,{cache:"no-store"});if(!t.ok)return[];const o=await t.json();return(Array.isArray(o)?o:o.posts||[]).slice(0,e).map(n=>({permalink:n.permalink||n.url||u.instagramUrl,img:n.sizes&&(n.sizes.medium?.mediaUrl||n.sizes.small?.mediaUrl)||n.mediaUrl||n.thumbnailUrl||"",video:String(n.mediaType||"").toUpperCase()==="VIDEO"})).filter(n=>n.img)}catch{return[]}}function w(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const S=document.getElementById("ig-sec"),v=document.getElementById("ig-grid");A(12).then(e=>{!v||!e.length||(v.innerHTML=e.map(r=>`
          <a
            href="${w(r.permalink)}"
            target="_blank"
            rel="noopener"
            class="group relative block aspect-square overflow-hidden rounded-marca border border-fundo-borda bg-fundo-claro"
            aria-label="Ver publicação no Instagram"
          >
            <img
              src="${w(r.img)}"
              alt="Publicação do Instagram da Lojinha da Miih"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            ${r.video?'<span class="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">vídeo</span>':""}
          </a>`).join(""),S?.classList.remove("hidden"))}).catch(e=>console.error("[instagram] erro ao carregar:",e));
