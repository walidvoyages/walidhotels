/* Walid Hotels multilingual booking assistant — safe offline guidance + optional secure AI API. */
(()=>{
"use strict";
const root=document.getElementById("walidChat");
if(!root)return;
const $=s=>root.querySelector(s);
const text={fr:{title:"Assistant Walid Hotels",sub:"Hôtels, réservations, Omra et voyages",hello:"Marhba ! 👋 Je vous aide à trouver un hôtel, comparer les options et ouvrir une recherche de prix exacte.",placeholder:"Écrivez votre question…",send:"Envoyer",price:"Prix d’un hôtel",find:"Trouver un hôtel",omra:"Omra",tours:"Voyages",faq:"FAQ",askPrice:"Donnez-moi le nom de l’hôtel, je prépare votre recherche avec les dates choisies. Les prix et disponibilités sont vérifiés sur le moteur officiel.",missing:"Pour obtenir le prix et les disponibilités en temps réel, ouvrez la recherche officielle ci-dessous. Je ne peux pas confirmer un tarif ici.",found:"Voici l’hôtel dans notre catalogue : ",book:"Rechercher les prix et disponibilités",general:"Je peux vous aider à choisir une destination, retrouver un hôtel, lire les FAQ ou démarrer une réservation. Pour un prix actualisé, utilisez la recherche officielle.",omraAnswer:"Les programmes Omra publiés par notre équipe sont accessibles sur cette page.",tourAnswer:"Les voyages organisés publiés par notre équipe sont accessibles sur cette page.",links:"Voir les programmes",online:"IA activée",offline:"Assistant guidé",unavailable:"Je peux continuer à vous guider vers la réservation officielle.",close:"Fermer",language:"Langue",cost:"Les tarifs dépendent des dates, de la chambre et de la disponibilité.",ready:"Écrivez le nom de l’hôtel ou votre question."},
ar:{title:"مساعد وليد للنزل",sub:"النزل والحجوزات والعمرة والرحلات",hello:"مرحبا بيك! 👋 نعاونك تختار نزل وتلقى رابط البحث بالأسعار والتواريخ.",placeholder:"اكتب سؤالك…",send:"إرسال",price:"أسعار النزل",find:"نحب نزل",omra:"العمرة",tours:"رحلات منظمة",faq:"أسئلة",askPrice:"اكتب اسم النزل، ونحضّرلك البحث بالتواريخ اللي اخترتها. السعر والتوفّر تتثبت منهم في موقع الحجز الرسمي.",missing:"للسعر الحالي والتوفّر افتح البحث الرسمي. ما نقدرش نأكد السعر من هنا.",found:"لقيت النزل هذا في الكتالوج: ",book:"شوف الأسعار والتوفّر",general:"نعاونك تختار النزل، تكتشف الوجهات وتلقى رابط الحجز الرسمي. الأسعار تتثبت في محرك الحجز.",omraAnswer:"تلقى برامج العمرة المنشورة من الإدارة في نفس الصفحة.",tourAnswer:"تلقى الرحلات المنظمة في نفس الصفحة.",links:"شوف البرامج",online:"المساعد الذكي شغّال",offline:"مساعد تفاعلي",unavailable:"تنجم تكمل البحث في موقع الحجز الرسمي.",close:"إغلاق",language:"اللغة",cost:"الأسعار تختلف حسب التواريخ والغرفة والتوفّر.",ready:"اكتب اسم النزل أو سؤالك."},
tn:{title:"مساعد Walid Hotels",sub:"نساعـدوك تلقى أحسن عطلة",hello:"عسلامة! 👋 شنية النزل اللي تحب عليه؟ نعطيك رابط البحث بالاسم والتواريخ متاعك.",placeholder:"أكتب شنوة تحب تسأل…",send:"ابعث",price:"قدّاش سوم النزل؟",find:"نلوّج على نزل",omra:"عمرة",tours:"رحلات منظمة",faq:"أسئلة",askPrice:"قلي اسم النزل ونحضرلك recherche فيه تواريخ الدخول والخروج. السوم الصحيح تلقاه في موقع الحجز.",missing:"باش تعرف السوم والتوفّر توّا، إضغط على رابط البحث الرسمي. ما نحبّش نعطيك سوم موش متأكدين منو.",found:"هاو النزل اللي لقيتو: ",book:"إفتح البحث في Walid Voyages",general:"نجم نعاونك تختار نزل، مدينة، عمرة ولا رحلة. وقت السعر نحطّك مباشرة في moteur de réservation.",omraAnswer:"برامج العمرة تلقاهم في نفس الصفحة، حسب العروض اللي نشرتها الإدارة.",tourAnswer:"الرحلات المنظمة موجودة في نفس الصفحة.",links:"شوف العروض",online:"مساعد IA",offline:"مساعد مباشر",unavailable:"تنجم تكمل مع recherche officiel.",close:"سكر",language:"اللغة",cost:"السوم يتبدّل حسب النهار، نوع الغرفة، والتوفّر.",ready:"إكتب اسم النزل أو سؤالك."},
en:{title:"Walid Hotels Assistant",sub:"Hotels, bookings and trips",hello:"Welcome! 👋 I can help you find hotels, browse options, and open an exact price search with your dates.",placeholder:"Ask about hotels or travel…",send:"Send",price:"Hotel prices",find:"Find a hotel",omra:"Umrah",tours:"Organized tours",faq:"FAQ",askPrice:"Tell me the hotel name; I'll prepare a search with your selected dates. Rates and availability must be confirmed in the official booking engine.",missing:"For current rates and availability, use the official search link. I can't verify a live price here.",found:"I found this hotel in our catalogue: ",book:"Check live prices and availability",general:"I can help find a hotel, browse destinations, or open the official booking search. Rates are verified in the booking system.",omraAnswer:"Current Umrah programs published by our team are listed on this page.",tourAnswer:"Organized trips are listed on this page.",links:"Browse programs",online:"AI available",offline:"Guided assistant",unavailable:"You can still use the official booking search.",close:"Close",language:"Language",cost:"Rates depend on stay dates, room category and availability.",ready:"Enter a hotel name or question."}};
const initial=document.documentElement.lang==="ar"?"tn":"fr";
let lang=initial,api="",history=[],modeAI=false,busy=false,hasGreeted=false;
const ref=(id)=>document.getElementById(id);
const langs=[["tn","تونسي"],["ar","العربية"],["fr","Français"],["en","English"]];
root.innerHTML='<button type="button" class="chat-fab" aria-controls="chatPanel" aria-expanded="false" aria-label="Ouvrir l’assistant"><span aria-hidden="true">✦</span><span class="chat-fab-caption">Walid Assistant</span></button><section id="chatPanel" class="chat-panel" hidden aria-label="Walid Hotels Assistant"><header class="chat-head"><span class="chat-mark">W</span><div class="chat-heading"><strong id="chatTitle"></strong><small id="chatSubtitle"></small></div><button type="button" class="chat-close" aria-label="Fermer">×</button></header><div class="chat-tools"><label for="chatLanguage">🌐</label><select id="chatLanguage" aria-label="Langue">'+langs.map(([code,name])=>'<option value="'+code+'">'+name+'</option>').join("")+'</select><small id="chatStatus"></small></div><div class="chat-messages" role="log" aria-live="polite" aria-relevant="additions" id="chatMessages"></div><div id="chatChips" class="chat-chips"></div><form id="chatForm" class="chat-form"><label class="sr-only" for="chatInput">Message</label><input id="chatInput" type="text" maxlength="450" autocomplete="off" required><button class="chat-send" type="submit">➤</button></form><div class="chat-disclaimer">Walid Voyages · <a href="https://www.walid-voyages.com/liste" target="_blank" rel="noopener noreferrer">Réservation officielle ↗</a></div></section>';
const fab=$(".chat-fab"),panel=$("#chatPanel"),feed=$("#chatMessages"),form=$("#chatForm"),input=$("#chatInput"),select=$("#chatLanguage");
const message=(role,str,link)=>{const div=document.createElement("div");div.className="chat-bubble "+role;const p=document.createElement("p");p.textContent=String(str||"").slice(0,1400);div.append(p);if(link){const a=document.createElement("a");a.href=link.url;a.target=link.url.startsWith("#")?"_self":"_blank";a.rel="noopener noreferrer";a.textContent=link.label||text[lang].book;div.append(a);}feed.append(div);feed.scrollTop=feed.scrollHeight;return div;};
const getDates=()=>({checkin:ref("arrival")?.value||"",checkout:ref("departure")?.value||"",guests:Number(ref("guests")?.value||2)});
const normalize=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9\u0600-\u06ff ]/g," ").replace(/\s+/g," ").trim();
const terms=(s)=>normalize(s).split(" ").filter(Boolean);
const CITY_ALIASES={
"Hammamet":["hammamet","hamamet","hamamet","الحمامات","حمامات"],
"Sousse":["sousse","soussa","sousah","سوسة","سوسه"],
"Djerba":["djerba","jerba","jerbah","جربة","جربه"],
"Mahdia":["mahdia","mehdia","المهدية","المهديه"],
"Monastir":["monastir","mestir","mounastir","المنستير","منستير"],
"Tabarka":["tabarka","طبرقة","طبرقه"],
"Gammarth":["gammarth","gamarth","قمرت"],
"Tunis":["tunis","tounes","تونس","العاصمة"],
};
const cityOf=q=>{let n=normalize(q);return Object.entries(CITY_ALIASES).find(([,v])=>v.some(w=>n.includes(normalize(w))))?.[0]||"";};
const catalog=()=>Array.isArray(window.walidHotelsData)?window.walidHotelsData.filter(h=>h&&h.name&&h.city):[];
const official=h=>{try{const u=new URL(h?.officialUrl||"");return u.protocol==="https:"&&["www.walid-voyages.com","walid-voyages.com"].includes(u.hostname)&&/^\/details\/[0-9]+\/?$/.test(u.pathname)?u.href:"";}catch{return "";}};
const wa=(hotel="",city="")=>{const d=getDates();const lines=lang==="fr"?["Bonjour, je souhaite recevoir une offre Walid Voyages."]:["عسلامة، نحب نستفسر على حجز عند Walid Voyages."];
if(hotel)lines.push((lang==="fr"?"Hôtel : ":"النزل: ")+hotel);
if(city)lines.push((lang==="fr"?"Ville : ":"الوجهة: ")+city);
if(d.checkin)lines.push((lang==="fr"?"Arrivée : ":"الدخول: ")+d.checkin);
if(d.checkout)lines.push((lang==="fr"?"Départ : ":"الخروج: ")+d.checkout);
lines.push((lang==="fr"?"Voyageurs : ":"عدد المسافرين: ")+d.guests);
return "https://wa.me/21658150699?text="+encodeURIComponent(lines.join("\n"));};
const booking=()=> "https://www.walid-voyages.com/liste";
const wordsOfHotel=h=>terms(h.name).filter(w=>w.length>=3&&!["hotel","hôtel","resort","spa","thalasso","the","and","tunisie","tunis","sousse","hammamet","djerba","mahdia","monastir","tabarka","gammarth"].includes(w));
const chooseHotel=s=>{
 const n=normalize(s);let matches=[];
 if(n.length<3)return null;
 for(const h of catalog()){
  const name=normalize(h.name);
  const parts=wordsOfHotel(h);
  const hit=parts.filter(w=>n.includes(w));
  const nameInside=n.includes(name);
  let score=(nameInside?100:0)+(hit.length>=2?hit.length*15:0);
  if(hit.length===1&&parts.length===1&&parts[0].length>=5)score=30;
  if(score>=25)matches.push({h,score});
 }
 matches.sort((a,b)=>b.score-a.score);
 return matches[0]?.h||null;
};
const isPrice=s=>/(prix|tarif|soum|9adech|9addech|b9adech|قداش|بقداش|سعر|الثمن|price|rate|cost|دينار|dt\b|combien)/i.test(s);
const isFAQ=s=>/(faq|check.?in|check.?out|annul|équip|equip|service|piscine|wifi|فطور|إلغاء|الغاء|خدمات|مسبح|دخول|خروج)/i.test(s);
const hotelMatches=(city)=>catalog().filter(h=>h.city===city).slice(0,6);
const state={lastHotel:null,lastCity:""};
function linkFor(h){const u=official(h);return {url:u||wa(h.name,h.city),label:u?(lang==="fr"?"Voir la fiche officielle ↗":"صفحة النزل الأصلية ↗"):(lang==="fr"?"Demander une offre par WhatsApp ↗":"استفسر عبر WhatsApp ↗")};}
function findFiltered(city){
 const chosen=city||state.lastCity;
 if(!chosen)return catalog().slice(0,5);
 return hotelMatches(chosen);
}
function faqText(h,q){
 const n=normalize(q);
 const opts=[
  {match:/(annul|cancel|إلغاء|الغاء)/i,answer:h.faqCancellation},
  {match:/(check.?in|check.?out|دخول|خروج|horaire)/i,answer:h.faqCheckin},
  {match:/(service|equip|piscine|wifi|فطور|مسبح|خدمات)/i,answer:h.faqServices}
 ];
 let chosen=opts.find(x=>x.match.test(n));
 return chosen&&chosen.answer?chosen.answer:"";
}
function fallback(question){
 const t=text[lang],n=normalize(question),explicitCity=cityOf(question);
 const hotel=chooseHotel(question)||(state.lastHotel&&(/^(قداش|soum|prix|tarif|reservation|réserver|reserver|حجز|نحب نحجز|الاسعار|السعر|شكون|faq|services|wifi|piscine|annulation)/i.test(n)||isFAQ(question))?state.lastHotel:null);
 const prices=isPrice(question);
 if(explicitCity)state.lastCity=explicitCity;
 if(hotel){
  state.lastHotel=hotel;state.lastCity=hotel.city;
  const faq=faqText(hotel,question);
  const details=(hotel.description||"").trim();
  const intro=(lang==="fr"?"J'ai trouvé ":"لقيت ") +hotel.name+" — "+hotel.city+".";
  const answer=intro+(details?"\n"+details:"")+(faq?"\n"+faq:"")+
   (prices?"\n"+t.cost+" "+t.missing:"");
  return {answer,link:linkFor(hotel),hotel};
 }
 if(/(omra|umrah|عمرة|3omra|3omret)/i.test(n))return{answer:t.omraAnswer,link:{url:"#omra-offers",label:t.links}};
 if(/(voyage|tour|رحل|rihla|sfar)/i.test(n))return{answer:t.tourAnswer,link:{url:"#tour-offers",label:t.links}};
 if(/(vol|billet|tayara|avion|طيران|تذكرة)/i.test(n))return {answer:lang==="fr"?"Pour les billets d'avion, consultez le site officiel ou contactez notre équipe.":"تذاكر الطيران تلقاها في موقع Walid Voyages الأصلي، وإلا اسأل الفريق.",link:{url:"https://www.walid-voyages.com/vols",label:lang==="fr"?"Billets d'avion ↗":"تذاكر الطيران ↗"}};
 if(/(agence|bureau|adresse|وين|بلاصة|فرع|وكالة)/i.test(n)&&!explicitCity)return {answer:lang==="fr"?"Vous pouvez retrouver les agences Walid Voyages et leurs coordonnées sur cette page.":"تلقى عناوين وأرقام وكالات Walid Voyages في نفس الصفحة.",link:{url:"#agences",label:lang==="fr"?"Nos agences":"وكالاتنا"}};
 if(explicitCity||/(hotel|hôtel|نزل|فندق|hotelet|hotelet|hotels|hôtels|recommend|propose|اقترح|nheb)/i.test(n)){
  const found=findFiltered(explicitCity);
  if(found.length){
   return {answer:(lang==="fr"?"Voici des hôtels de notre catalogue ":"هاذم نزل موجودين في كتالوج Walid Voyages ")+(explicitCity?"— "+explicitCity:"")+":\n"+found.map(h=>"• "+h.name).join("\n")+"\n"+(lang==="fr"?"Tarifs et disponibilités à vérifier sur le site officiel.":"السوم والتوفر يلزم يتثبتوا وقت الحجز."),hotels:found,link:{url:"#hotels",label:t.find},city:explicitCity};
  }
  return {answer:t.general,link:{url:"#hotels",label:t.find}};
 }
 if(prices)return {answer:t.askPrice,link:{url:wa("",state.lastCity),label:lang==="fr"?"Demander un tarif ↗":"اطلب سوم ↗"}};
 return {answer:t.general,link:{url:wa("",state.lastCity),label:lang==="fr"?"Parler à l'équipe ↗":"احكي مع الفريق ↗"}};
}
function displayHotelCards(hotels){
 const wrap=document.createElement("div");wrap.className="chat-hotel-results";
 hotels.slice(0,4).forEach(h=>{
  const card=document.createElement("article");card.className="chat-hotel-result";
  const name=document.createElement("strong");name.textContent=h.name;card.append(name);
  const city=document.createElement("small");city.textContent="⌖ "+h.city;card.append(city);
  const a=document.createElement("a");const link=linkFor(h);a.href=link.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=link.label;card.append(a);
  wrap.append(card);
 });
 feed.append(wrap);feed.scrollTop=feed.scrollHeight;
}
function refresh(){const t=text[lang];$("#chatTitle").textContent=t.title;$("#chatSubtitle").textContent=t.sub;$("#chatStatus").textContent=modeAI?t.online:t.offline;input.placeholder=t.placeholder;$(".chat-send").setAttribute("aria-label",t.send);$(".chat-close").setAttribute("aria-label",t.close);select.value=lang;$("#chatChips").replaceChildren();[[t.find,"hôtel à Hammamet"],[t.price,"prix de Marhaba Royal Salem"],[t.omra,"Omra"],[t.tours,"voyages organisés"],[t.faq,"questions sur les hôtels"]].forEach(([label,query])=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.addEventListener("click",()=>send(query));$("#chatChips").append(b);});if(!hasGreeted){message("assistant",t.hello);hasGreeted=true;}}
select.addEventListener("change",()=>{lang=select.value;refresh();message("assistant",text[lang].ready);});
fab.addEventListener("click",()=>{panel.hidden=!panel.hidden;fab.setAttribute("aria-expanded",String(!panel.hidden));if(!panel.hidden){refresh();input.focus();}});
$(".chat-close").addEventListener("click",()=>{panel.hidden=true;fab.setAttribute("aria-expanded","false");fab.focus();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden){panel.hidden=true;fab.setAttribute("aria-expanded","false");fab.focus();}});
async function send(question){if(busy)return;question=String(question||"").trim().slice(0,450);if(!question)return;input.value="";message("user",question);busy=true;$(".chat-send").disabled=true;const suggestion=fallback(question);
let answer=suggestion.answer;
if(api){try{const d=getDates();const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),12000);let response;try{response=await fetch(api,{method:"POST",mode:"cors",signal:ctrl.signal,headers:{"content-type":"application/json"},body:JSON.stringify({message:question,language:lang,hotel:chooseHotel(question)?.name||"",checkin:d.checkin,checkout:d.checkout,guests:d.guests})});}finally{clearTimeout(timer);}if(!response.ok)throw Error("chat "+response.status);const data=await response.json();if(data.answer&&typeof data.answer==="string"){answer=data.answer.slice(0,1300);modeAI=!!data.ai;$("#chatStatus").textContent=modeAI?text[lang].online:text[lang].offline;}}catch(err){console.warn("Walid assistant mode guidé",err.message);modeAI=false;$("#chatStatus").textContent=text[lang].offline;}}
message("assistant",answer,suggestion.link);if(suggestion.hotels)displayHotelCards(suggestion.hotels);history.push({q:question,a:answer});if(history.length>4)history.shift();busy=false;$(".chat-send").disabled=false;input.focus();}
form.addEventListener("submit",e=>{e.preventDefault();send(input.value);});
refresh();
// Admin-managed public configuration. No API secrets are stored here.
Promise.all([import("https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js")]).then(([app,dbapi])=>{const a=app.initializeApp({apiKey:"AIzaSyAdbjK1qmVS7Om1qLXr7NtUDhU0RfScIn4",authDomain:"walidvoyages-13332.firebaseapp.com",databaseURL:"https://walidvoyages-13332-default-rtdb.firebaseio.com",projectId:"walidvoyages-13332",appId:"1:1037120577066:web:3aebac424185905ee7ed53"},"walid-chat-public");dbapi.onValue(dbapi.ref(dbapi.getDatabase(a),"siteSettings/chatbot"),snap=>{const o=snap.val()||{};try{const u=new URL(o.endpoint||"");api=u.protocol==="https:"&&(o.enabled===true||o.enabled==="true")?u.href:"";}catch{api="";}},()=>{api="";});}).catch(()=>{});
})();