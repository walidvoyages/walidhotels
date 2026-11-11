/* Agency directory - original branch assets and optional admin updates */
(()=>{
const ar=document.documentElement.lang==="ar";
const safe=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const grid=document.getElementById("agencyGrid");if(!grid)return;
const approved=(url,kind)=>{try{let x=new URL(url,location.href);if(x.protocol!=="https:"&&x.origin!==location.origin)return "";if(kind==="photo")return x.origin===location.origin||["res.cloudinary.com","images.unsplash.com","raw.githubusercontent.com"].includes(x.hostname)?x.href:"";if(kind==="map")return ["www.google.com","maps.google.com","google.com","share.google"].includes(x.hostname)?x.href:"";return x.href;}catch{return ""}};
const key=n=>String(n||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");
const defaults=[...grid.querySelectorAll(".agency-card")].map(el=>({name:key(el.dataset.agencyCity),html:el.outerHTML}));
function agencyTemplate(o){
const title=safe(o.title),city=safe(o.address||o.title),tel=String(o.phone||"").replace(/[^\d]/g,""),photo=approved(o.image,"photo")||"logo-walid-transparent.png",map=approved(o.map,"map"),card=approved(o.link,"link")||"agences/";
return '<article class="agency-card"><a class="agency-photo" href="'+safe(card)+'" rel="noopener noreferrer"><img loading="lazy" src="'+safe(photo)+'" alt="'+title+'"></a><div class="agency-info"><small class="agency-index">WALID VOYAGES</small><h3>'+title+'</h3><p class="agency-address">⌖ '+city+'</p>'+(tel?'<p class="agency-phone"><a href="tel:+'+tel+'">☎ +'+tel+'</a></p>':'')+'<div class="agency-actions">'+(map?'<a class="agency-map" target="_blank" rel="noopener noreferrer" href="'+safe(map)+'">Google Maps ↗</a>':'')+'<a class="agency-digital" href="'+safe(card)+'">'+(ar?"البطاقة الإلكترونية":"Carte électronique")+' ↗</a></div></div></article>';
}
Promise.all([import("https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js")]).then(([app,dbapi])=>{
const firebase=app.initializeApp({apiKey:"AIzaSyAdbjK1qmVS7Om1qLXr7NtUDhU0RfScIn4",authDomain:"walidvoyages-13332.firebaseapp.com",databaseURL:"https://walidvoyages-13332-default-rtdb.firebaseio.com",projectId:"walidvoyages-13332",appId:"1:1037120577066:web:3aebac424185905ee7ed53"},"walid-agencies-public");
dbapi.onValue(dbapi.ref(dbapi.getDatabase(firebase),"agencies"),snap=>{
const records=Object.values(snap.val()||{}).filter(o=>o?.published===true&&o.title);if(!records.length)return;
const updated=new Map(defaults.map(x=>[x.name,x.html]));records.forEach(o=>updated.set(key(o.title.replace(/walid voyages/gi,"")),agencyTemplate(o)));
grid.innerHTML=[...updated.values()].join("");
},()=>{});
}).catch(()=>{});
})();
