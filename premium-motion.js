/* Walid Voyages — animations légères (aucune dépendance). Ne touche ni Firebase ni le SEO. */
(()=>{
const d=document,root=d.documentElement,ar=root.lang==='ar';
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,c=d)=>c.querySelector(s),$$=(s,c=d)=>[...c.querySelectorAll(s)];
if(calm)return;
root.classList.add('js-motion');
/* progression + en-tête + parallaxe */
const bar=d.createElement('div');bar.className='wv-progress';bar.setAttribute('aria-hidden','true');d.body.prepend(bar);
const head=$('.sitehead'),poster=$('.hero-photo-v12');
let tick=false;
const onScroll=()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{
 const y=scrollY,h=root.scrollHeight-innerHeight;
 bar.style.transform=`scaleX(${h>0?Math.min(y/h,1):0})`;
 head&&head.classList.toggle('is-stuck',y>40);
 if(poster&&y<innerHeight*1.2)poster.style.setProperty('--py',(y*.14).toFixed(1)+'px');
 tick=false})};
addEventListener('scroll',onScroll,{passive:true});onScroll();
/* avion décoratif dans le hero */
if(poster){const p=d.createElement('div');p.className='wv-plane';p.setAttribute('aria-hidden','true');
 p.innerHTML='<svg viewBox="0 0 64 64" fill="currentColor"><path d="M62 30 40 24 26 6c-.4-.5-1-.8-1.7-.8h-3.5c-1 0-1.600 1-1.200 1.900L26 24 10 25 5 18c-.3-.4-.8-.7-1.400-.7H1.700c-.8 0-1.300.8-1 1.500L4 30 .7 41.200c-.3.700.2 1.500 1 1.500h1.900c.600 0 1.100-.3 1.400-.7l5-7 16 1-5.200 17.100c-.4.900.2 1.900 1.200 1.900h3.500c.7 0 1.300-.3 1.700-.8L40 40l22-6c2-.6 2-3.400 0-4z"/></svg>';
 poster.appendChild(p)}
/* puces catégories sous la barre de réservation */
const inner=$('.booking-inner');
if(inner&&!$('.wv-chips')){const L=ar?[['ar-omra-tunisie.html','🕋 عمرة'],['ar-vols-tunisie.html','✈ رحلات جوية'],['ar-hotels-tunisie.html','🏨 فنادق'],['ar-voyages-tunisie.html','🧭 رحلات منظمة']]:[['omra-tunisie.html','🕋 Omra'],['vols-tunisie.html','✈ Vols'],['hotels-tunisie.html','🏨 Hôtels'],['voyages-organises-tunisie.html','🧭 Voyages organisés']];
 const w=d.createElement('div');w.className='wv-chips';w.innerHTML=L.map(([h,t])=>`<a href="${h}">${t}</a>`).join('');inner.appendChild(w)}
/* apparition en cascade */
$$('.destination-grid,.offer-grid,.agencygrid,.story-chips,.seo-links').forEach(g=>$$('.reveal',g).forEach((el,i)=>el.style.setProperty('--d',(i*.12)+'s')));
$$('.story-chips>div,.seo-links a,.offer-card').forEach((el,i)=>{if(!el.classList.contains('reveal')){el.classList.add('reveal');el.style.setProperty('--d',((i%4)*.1)+'s')}});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.12});
const watch=()=>$$('.reveal:not(.show)').forEach(el=>io.observe(el));watch();
new MutationObserver(watch).observe(d.body,{childList:true,subtree:true}); /* offres Firebase ajoutées plus tard */
/* inclinaison 3D + boutons magnétiques (souris uniquement) */
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 d.addEventListener('pointermove',e=>{
  const c=e.target.closest&&e.target.closest('.destination,.offer-card');
  $$('.destination,.offer-card').forEach(el=>{if(el!==c)el.style.transform=''});
  if(c){const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   c.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-6px)`}
  const b=e.target.closest&&e.target.closest('.pillbtn,.reserve,.showcase-primary,.showcase-secondary');
  $$('.pillbtn,.reserve,.showcase-primary,.showcase-secondary').forEach(el=>{if(el!==b)el.style.translate=''});
  if(b){const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.18}px ${(e.clientY-r.top-r.height/2)*.28}px`}
 },{passive:true});
 d.addEventListener('pointerleave',()=>$$('.destination,.offer-card,.pillbtn,.reserve,.showcase-primary,.showcase-secondary').forEach(el=>{el.style.transform='';el.style.translate=''}));
}
})();
