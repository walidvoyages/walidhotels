/* Walid Hotels Premium — public catalogue and moderated reviews. No fabricated prices/ratings. */
(function(){
"use strict";
var ar=document.documentElement.lang==="ar";
var BOOK="https://www.walid-voyages.com/liste";
var WA="https://wa.me/21658150699";
var assets=[
"photo-1566073771259-6a8506099945","photo-1571896349842-33c89424de2d",
"photo-1551882547-ff40c63fe5fa","photo-1542314831-068cd1dbfeeb",
"photo-1520250497591-112f2f40a3f4","photo-1582719508461-905c673771fd",
"photo-1564501049412-61c2a3083791","photo-1578683010236-d716f9a3f461",
"photo-1571003123894-1f0594d2b5d9","photo-1540541338287-41700207dee6",
"photo-1584132967334-10e028bd69f7","photo-1568084680786-a84f91d1153c"
];
function img(i){return "https://images.unsplash.com/"+assets[i%assets.length]+"?auto=format&fit=crop&w=900&q=82";}
var hotels=[
{n:"Mövenpick Resort & Marine Spa Sousse",c:"Sousse",s:5,p:img(0),v:1,f:"Resort en bord de mer et séjour bien-être à Sousse.",a:"منتجع على البحر وإقامة للاسترخاء في سوسة."},
{n:"TUI MAGIC LIFE Africana",c:"Hammamet",s:5,p:img(1),v:1,f:"Club hôtel de Yasmine Hammamet pour les vacances en famille.",a:"نزل بنظام نادي في ياسمين الحمامات للعطل العائلية."},
{n:"Green Golf Hammamet",c:"Hammamet",s:null,p:img(2),v:1,f:"Séjour pratique à Yasmine Hammamet, près de la marina.",a:"إقامة في ياسمين الحمامات بالقرب من المارينا."},
{n:"Résidence Romane",c:"Hammamet",s:null,p:img(3),v:1,f:"Une adresse à découvrir pour vos escapades à Hammamet.",a:"عنوان يستحق الاكتشاف لقضاء عطلتك في الحمامات."},
{n:"Le Corail Appart'hôtel Yasmine Hammamet",c:"Hammamet",s:null,p:img(4),v:1,f:"Appart'hôtel à Yasmine Hammamet pour des séjours flexibles.",a:"شقق فندقية في ياسمين الحمامات لإقامة على راحتك."},
{n:"Royal Thalassa Monastir",c:"Monastir",s:5,p:img(5),f:"Plage, spa et thalassothérapie sur la côte de Monastir.",a:"شاطئ وسبا وعلاج بمياه البحر على ساحل المنستير."},
{n:"Iberostar Selection Royal El Mansour",c:"Mahdia",s:5,p:img(6),f:"Grand hôtel face à la plage de Mahdia.",a:"نزل مطلّ على شاطئ المهدية."},
{n:"La Badira",c:"Hammamet",s:5,p:img(7),f:"Hôtel réservé aux adultes, suites et vues sur la Méditerranée.",a:"نزل للبالغين مع أجنحة وإطلالات على البحر الأبيض المتوسط."},
{n:"The Residence Tunis",c:"Gammarth",s:5,p:img(8),f:"Séjour raffiné à Gammarth, sur la côte de Carthage.",a:"إقامة راقية في قمرت على ضفاف ساحل قرطاج."},
{n:"Marhaba Royal Salem",c:"Sousse",s:null,p:img(9),f:"Une autre idée de séjour sur la côte de Sousse.",a:"اقتراح آخر لقضاء عطلة في سوسة."},
{n:"El Mouradi Djerba Menzel",c:"Djerba",s:null,p:img(10),f:"Une adresse à explorer pour vos vacances à Djerba.",a:"اقتراح لإقامتك في جزيرة جربة."},
{n:"La Cigale Tabarka Hôtel Thalasso & Spa",c:"Tabarka",s:null,p:img(11),f:"Nature et détente au bord de la Méditerranée à Tabarka.",a:"طبيعة واسترخاء على شاطئ طبرقة."}
];
var adminHotels=[];
var reviews={};
var selected="all",expanded=false;
var grid=document.getElementById("hotelGrid");
var more=document.getElementById("loadMore");
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(k){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k];});}
function key(s){return String(s||"").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");}
function safeUrl(url){try{var u=new URL(url,location.href);return u.protocol==="https:"&&(["images.unsplash.com","res.cloudinary.com","www.walid-voyages.com","walid-voyages.com"].indexOf(u.hostname)!==-1)?u.href:"";}catch(e){return "";}}
function cover(u,idx){return safeUrl(u)||img(idx);}
function isPublished(v){return !!v && (v.published===true||v.published==="true");}
function official(){return BOOK;}
// Only link directly to confirmed hotel details from the original booking website.
function verifiedOfficialHotelLink(h){
 var raw=String(h.u||"");
 // Official records managed in Admin take priority, but reject unrelated or listing URLs.
 if(raw){
  try{
   var url=new URL(raw);
   if(url.protocol==="https:"&&["www.walid-voyages.com","walid-voyages.com"].includes(url.hostname)&&new RegExp("^/details/[0-9]+/?$").test(url.pathname))return url.href;
  }catch(e){}
 }
 // The only confirmed static mapping; other hotels need their actual ID in Admin.
 if(key(h.n)==="tuimagiclifeafricana")return "https://www.walid-voyages.com/details/166";
 return "";
}
function googleMapsLink(h){
 var url=new URL("https://www.google.com/maps/search/");
 url.searchParams.set("api","1");
 url.searchParams.set("query",h.n+", "+h.c+", Tunisie");
 if(h.googlePlaceId && /^[A-Za-z0-9_-]{10,256}$/.test(h.googlePlaceId)){
  url.searchParams.set("query_place_id",h.googlePlaceId);
 }
 return url.href;
}
function rotate(items){if(items.length<2)return items;let day=Math.floor(Date.now()/86400000);let offset=day%items.length;return items.slice(offset).concat(items.slice(0,offset));}
function enquiry(name){var from=document.getElementById("arrival"),to=document.getElementById("departure"),guests=document.getElementById("guests");
var txt=(ar?"السلام عليكم، نحب نستفسر على حجز نزل ":"Bonjour, je souhaite une offre pour l’hôtel ")+name+".\n"+
(ar?"تاريخ الدخول: ":"Arrivée : ")+(from&&from.value?from.value:"à préciser")+"\n"+
(ar?"تاريخ الخروج: ":"Départ : ")+(to&&to.value?to.value:"à préciser")+"\n"+
(ar?"عدد المسافرين: ":"Voyageurs : ")+(guests?guests.value:"2");
return WA+"?text="+encodeURIComponent(txt);}
function allHotels(){var combined=rotate(hotels.slice());adminHotels.forEach(function(h){var k=key(h.n),idx=combined.findIndex(function(p){return key(p.n)===k;});if(idx>=0)combined[idx]=Object.assign({},combined[idx],h);else combined.push(h);});return combined.sort(function(a,b){return Number(b.v)-Number(a.v);});}
function reviewHtml(h){
var list=reviews[key(h.n)]||[];
var title=ar?"آراء الحرفاء":"Avis clients";
function quote(r){
 var count=Math.max(0,Math.min(5,Number(r.score)||0));
 return '<article class="review-quote">'+
 (count?'<span class="stars" aria-label="'+count+'/5">'+("★".repeat(count))+'</span>':'')+
 '<blockquote>“'+esc(r.comment)+'”</blockquote><small>'+esc(r.author)+(r.stayDate?' · '+esc(r.stayDate):'')+'</small></article>';
}
var preview=list.slice(0,2).map(quote).join("");
var rest=list.length>2?'<details class="hotel-review"><summary>'+(ar?"عرض باقي الآراء ("+(list.length-2)+")":"Voir les autres avis ("+(list.length-2)+")")+'</summary>'+list.slice(2,8).map(quote).join("")+'</details>':'';
var empty='<p class="review-empty">'+(ar?"مازال ما فماش آراء منشورة للنزل هذا.":"Aucun avis publié pour cet hôtel pour le moment.")+'</p>';
return '<section class="hotel-feedback" aria-label="'+title+'">'+
 '<div class="feedback-title"><strong>'+title+'</strong><small>'+list.length+' '+(ar?"آراء منشورة":"avis publiés")+'</small></div>'+
 (list.length?preview+rest:empty)+
 '<button class="write-review" type="button" data-review-hotel="'+esc(h.n)+'">'+(ar?"اكتب رأيك في النزل ★":"Donner mon avis sur cet hôtel ★")+'</button>'+
 '<p class="feedback-notice">'+(ar?"الآراء يكتبها الزوّار وتنشر بعد مراجعة الإدارة؛ موش تقييمات من Google.":"Avis soumis par les visiteurs et publiés après modération, distincts des avis Google.")+'</p></section>';
}
function hotelHtml(h,i){
var st=Number(h.s);var valid=Number.isInteger(st)&&st>=1&&st<=5;var rating=valid?'<span class="stars" aria-label="'+st+(ar?" نجوم":" étoiles")+'">'+("★".repeat(st))+'</span><span class="stars-label">'+st+(ar?" نجوم":" étoiles")+'</span>':'<span class="stars-label">'+(ar?"التصنيف عند الطلب":"Classement sur demande")+'</span>';
var c=esc(h.c);var n=esc(h.n);var link=verifiedOfficialHotelLink(h);var maps=googleMapsLink(h);
var faqEntries=[[(ar?"أوقات الدخول والخروج":"Horaires de check-in/check-out"),h.faqCheckin],[(ar?"الخدمات والتجهيزات":"Services et équipements"),h.faqServices],[(ar?"سياسة الإلغاء":"Conditions d’annulation"),h.faqCancellation]].filter(function(q){return typeof q[1]==="string"&&q[1].trim();});
var faqMarkup=faqEntries.length?'<details class="hotel-review hotel-faq"><summary>'+(ar?"أسئلة على النزل":"Questions sur cet hôtel")+' ('+faqEntries.length+')</summary>'+faqEntries.map(function(q){return '<p><strong>'+esc(q[0])+'</strong><span style="display:block">'+esc(q[1])+'</span></p>';}).join("")+'</details>':"";
return '<article class="hotel-card"><div class="hotel-media">'+(link?'<a class="hotel-official-photo" href="'+esc(link)+'" target="_blank" rel="noopener noreferrer" aria-label="'+(ar?"الصفحة الأصلية للنزل ":"Fiche officielle de ")+n+'">':'')+'<img src="'+esc(cover(h.p,i))+'" loading="lazy" alt="'+(ar?"صورة توضيحية لوجهة ":"Photo d’ambiance, destination ")+c+'" onerror="this.onerror=null;this.src=\'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80\'">'+(link?'</a>':'')+'<span class="hotel-pill">'+(link?(ar?"صفحة النزل الأصلية":"Fiche officielle disponible"):(ar?"الرابط الرسمي قيد التثبت":"Fiche officielle à confirmer"))+'</span><small class="hotel-illustration">'+(ar?"صورة توضيحية":"Photo d’ambiance")+'</small></div><div class="hotel-body"><div class="hotel-location">⌖ '+c+', '+(ar?"تونس":"Tunisie")+'</div><h3>'+(link?'<a href="'+esc(link)+'" target="_blank" rel="noopener noreferrer">'+n+'</a>':n)+'</h3><div>'+rating+'</div><p class="hotel-desc">'+esc(ar?h.a:h.f)+'</p><div class="hotel-divider"></div><div class="hotel-bottom"><div><small>'+(ar?"الأسعار حسب التاريخ والتوفّر":"Tarifs selon dates et disponibilité")+'</small><strong>'+(ar?"التثبت في السعر":"Prix à consulter")+'</strong></div>'+(link?'<a href="'+esc(link)+'" rel="noopener noreferrer" target="_blank">'+(ar?"امشي لصفحة النزل الأصلية ↗":"Voir la fiche officielle ↗")+'</a>':'<a href="'+esc(enquiry(h.n))+'" rel="noopener noreferrer" target="_blank">'+(ar?"اطلب رابط الحجز ↗":"Demander la fiche de réservation ↗")+'</a>')+'</div><p class="hotel-google-link"><a href="'+esc(maps)+'" target="_blank" rel="noopener noreferrer">'+(ar?"شوف النزل على Google Maps ↗":"Voir cet hôtel sur Google Maps ↗")+'</a></p>'+faqMarkup+reviewHtml(h)+'</div></article>';
}
function render(){
if(!grid)return;
var city=document.getElementById("city")?.value||"all";
var term=document.getElementById("hotelQuery")?.value.trim().toLocaleLowerCase()||"";
var results=allHotels().filter(function(h){return (selected==="all"||h.c===selected)&&(city==="all"||h.c===city)&&(!term||h.n.toLocaleLowerCase().includes(term)||h.c.toLocaleLowerCase().includes(term));});
var shown=expanded?results:results.slice(0,6);window.walidHotelsData=allHotels().map(h=>({
 name:h.n,city:h.c,stars:h.s,
 description:ar?(h.a||h.f||""):(h.f||h.a||""),
 officialUrl:verifiedOfficialHotelLink(h),
 faqCheckin:h.faqCheckin||"",
 faqServices:h.faqServices||"",
 faqCancellation:h.faqCancellation||""
}));document.dispatchEvent(new Event('walid:hotels-updated'));
grid.innerHTML=shown.length?shown.map(hotelHtml).join(""):'<div class="empty-results">'+(ar?"ما لقيناش نزل حسب الفلاتر. جرّب مدينة أخرى.":"Aucun hôtel ne correspond à ces filtres. Essayez une autre destination.")+'</div>';
if(more){more.hidden=results.length<=6;more.textContent=expanded?(ar?"عرض أقل ↑":"Voir moins ↑"):(ar?"عرض مزيد من النزل ↓":"Voir plus d’hôtels ↓");}
var count=document.getElementById("hotelCount");if(count)count.textContent=results.length+" "+(ar?"نزل في الكتالوج":"hôtels à découvrir");
}
document.querySelectorAll("[data-city]").forEach(function(b){b.addEventListener("click",function(){selected=b.getAttribute("data-city");expanded=false;document.querySelectorAll("[data-city]").forEach(function(el){el.classList.toggle("active",el===b);});var sel=document.getElementById("city");if(sel)sel.value="all";render();});});
document.getElementById("searchForm")?.addEventListener("submit",function(e){e.preventDefault();selected="all";expanded=true;document.querySelectorAll("[data-city]").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-city")==="all");});render();document.getElementById("hotels")?.scrollIntoView({behavior:"smooth"});});
more?.addEventListener("click",function(){expanded=!expanded;render();});
document.getElementById("hotelQuery")?.addEventListener("input",function(){expanded=true;render();});
setInterval(function(){render();},3600000);
var nav=document.getElementById("nav"),menu=document.getElementById("menuButton");
menu?.addEventListener("click",function(){var open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});
nav?.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){nav.classList.remove("open");menu?.setAttribute("aria-expanded","false");});});
document.getElementById("year").textContent=new Date().getFullYear();
var today=new Date();today.setHours(12,0,0,0);function fmt(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
var arrival=document.getElementById("arrival"),departure=document.getElementById("departure");
if(arrival&&departure){var d1=new Date(today),d2=new Date(today);d1.setDate(d1.getDate()+1);d2.setDate(d2.getDate()+2);arrival.min=fmt(today);arrival.value=fmt(d1);departure.min=fmt(d2);departure.value=fmt(d2);arrival.addEventListener("change",function(){if(!arrival.value)return;var d=new Date(arrival.value+"T12:00:00");d.setDate(d.getDate()+1);departure.min=fmt(d);if(!departure.value||departure.value<=arrival.value)departure.value=fmt(d);});}
render();
var fbConfig={apiKey:"AIzaSyAdbjK1qmVS7Om1qLXr7NtUDhU0RfScIn4",authDomain:"walidvoyages-13332.firebaseapp.com",databaseURL:"https://walidvoyages-13332-default-rtdb.firebaseio.com",projectId:"walidvoyages-13332",appId:"1:1037120577066:web:3aebac424185905ee7ed53",messagingSenderId:"1037120577066"};
Promise.all([import("https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js")]).then(function(mods){
var app=mods[0].initializeApp(fbConfig,"hotels-public");var db=mods[1].getDatabase(app);
mods[1].onValue(mods[1].ref(db,"hotels"),function(snap){var v=snap.val()||{};adminHotels=Object.values(v).filter(isPublished).map(function(o,i){return {n:String(o.title||""),c:String(o.city||"Tunisie"),s:o.stars?Number(o.stars):null,p:o.image||img(i),u:o.link||BOOK,googlePlaceId:o.googlePlaceId||"",f:o.description||"",a:o.description||"",v:1,faqCheckin:o.faqCheckin||"",faqServices:o.faqServices||"",faqCancellation:o.faqCancellation||""};}).filter(function(o){return o.n;});render();},function(err){console.warn("Hôtels Firebase indisponibles",err.code||err.message);});
mods[1].onValue(mods[1].ref(db,"hotelReviews"),function(snap){var v=snap.val()||{};reviews={};Object.values(v).filter(isPublished).forEach(function(r){var name=key(r.hotelName||r.hotelId||r.hotel||"");if(!name||!r.comment||!r.author)return;(reviews[name]||(reviews[name]=[])).push({author:String(r.author),comment:String(r.comment),score:r.score,stayDate:r.stayDate});});render();},function(err){console.warn("Avis Firebase indisponibles",err.code||err.message);});
}).catch(function(e){console.warn("Catalogue statique disponible, Firebase indisponible",e.message);});
})();