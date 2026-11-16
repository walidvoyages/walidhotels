/* Walid Hotels – accessible destination explorer.
 * No fabricated place or hotel links. The catalogue remains the source of hotel counts.
 */
(function(){
 "use strict";
 const ar=document.documentElement.lang==="ar";
 const destinations=[
  {name:"Hammamet",location:ar?"ولاية نابل · تونس":"Gouvernorat de Nabeul · Tunisie",image:"https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"},
  {name:"Sousse",location:ar?"ولاية سوسة · تونس":"Gouvernorat de Sousse · Tunisie",image:"https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80"},
  {name:"Djerba",location:ar?"ولاية مدنين · تونس":"Gouvernorat de Médenine · Tunisie",image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"},
  {name:"Mahdia",location:ar?"ولاية المهدية · تونس":"Gouvernorat de Mahdia · Tunisie",image:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"},
  {name:"Monastir",location:ar?"ولاية المنستير · تونس":"Gouvernorat de Monastir · Tunisie",image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"},
  {name:"Tabarka",location:ar?"ولاية جندوبة · تونس":"Gouvernorat de Jendouba · Tunisie",image:"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80"},
  {name:"Gammarth",location:ar?"ولاية تونس · تونس":"Gouvernorat de Tunis · Tunisie",image:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"}
 ];
 const el=id=>document.getElementById(id);
 const host=el("heroExplorer");
 if(!host)return;
 let selected=0;
 let image=el("heroCityImage");
 function show(index){
  selected=(index+destinations.length)%destinations.length;
  const d=destinations[selected];
  el("heroCityTitle").textContent=d.name;
  el("heroCityLocation").textContent=d.location;
  el("heroCityPosition").textContent=String(selected+1).padStart(2,"0")+" / "+String(destinations.length).padStart(2,"0");
  image.src=d.image;
  image.alt=(ar?"صورة توضيحية للوجهة ":"Photo d'ambiance : ")+d.name;
  const hotels=Array.isArray(window.walidHotelsData)?window.walidHotelsData.filter(h=>h.city===d.name):[];
  el("heroCityCount").textContent=hotels.length?
   (ar?hotels.length+" نزل في القائمة · تأكد من التوفر عند الحجز":hotels.length+" hôtels dans le catalogue · disponibilité à confirmer"):
   (ar?"اكتشف النزل والخدمات في الوجهة":"Explorez les hôtels et services de la destination");
  el("heroCityExplore").textContent=(ar?"شوف نزل ":"Voir les hôtels à ")+d.name+" ↗";
  host.querySelectorAll("[data-hero-city]").forEach(b=>{
   const on=b.dataset.heroCity===d.name;
   b.classList.toggle("is-active",on);
   b.setAttribute("aria-pressed",String(on));
  });
 }
 function visit(){
  const d=destinations[selected];
  const btn=Array.from(document.querySelectorAll(".category-filter [data-city]")).find(b=>b.dataset.city===d.name);
  if(btn)btn.click();
  document.getElementById("hotels")?.scrollIntoView({behavior:"smooth"});
 }
 host.querySelectorAll("[data-hero-city]").forEach(b=>b.addEventListener("click",()=>show(destinations.findIndex(d=>d.name===b.dataset.heroCity))));
 el("heroCityPrev")?.addEventListener("click",()=>show(selected-1));
 el("heroCityNext")?.addEventListener("click",()=>show(selected+1));
 el("heroCityExplore")?.addEventListener("click",e=>{e.preventDefault();visit()});
 // Refresh the count after Firebase catalogue loads without delaying interaction.
 document.addEventListener("walid:hotels-updated",()=>show(selected));
 show(0);
})();
