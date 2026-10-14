/* Remplace les symboles Unicode (✈ ☎ ↗ …) par des icônes SVG propres */
(()=>{
const P={'✈':'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.100.5l-.3.5c-.2.5-.1 1 .3 1.300L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.500 5.300c.3.4.8.5 1.300.3l.5-.2c.4-.3.6-.7.5-1.200z',
'⌂':'M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M12 4v6M2 18h20',
'☎':'M22 16.920v3a2 2 0 0 1-2.180 2 19.790 19.790 0 0 1-8.630-3.070 19.500 19.500 0 0 1-6-6A19.790 19.790 0 0 1 2.120 4.180 2 2 0 0 1 4.110 2h3a2 2 0 0 1 2 1.720c.13.960.36 1.900.7 2.810a2 2 0 0 1-.45 2.110L8.090 9.910a16 16 0 0 0 6 6l1.270-1.270a2 2 0 0 1 2.110-.45c.91.34 1.850.57 2.810.7A2 2 0 0 1 22 16.920z',
'☪':'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
'✧':'M12 3l1.900 5.100L19 10l-5.100 1.900L12 17l-1.900-5.100L5 10l5.100-1.900z','✦':'M12 3l1.900 5.100L19 10l-5.100 1.900L12 17l-1.900-5.100L5 10l5.100-1.900z',
'◇':'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
'◉':'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.870M16 3.130a4 4 0 0 1 0 7.740',
'↗':'M7 17 17 7M7 7h10v10','☰':'M3 6h18M3 12h18M3 18h18',
'✆':'M21 11.500a8.400 8.400 0 0 1-.9 3.800 8.500 8.500 0 0 1-7.600 4.700 8.400 8.400 0 0 1-3.800-.9L3 21l1.900-5.700a8.400 8.400 0 0 1-.9-3.800 8.500 8.500 0 0 1 4.700-7.600 8.400 8.400 0 0 1 3.800-.9h.5a8.500 8.500 0 0 1 8 8z'};
const re=new RegExp('['+Object.keys(P).join('')+']','g');
function run(root){
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>re.test(n.nodeValue)&&!/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName)?1:2});
 re.lastIndex=0;const list=[];while(w.nextNode())list.push(w.currentNode);
 list.forEach(n=>{re.lastIndex=0;const f=document.createDocumentFragment();let last=0,m,s=n.nodeValue;
  while((m=re.exec(s))){f.append(s.slice(last,m.index));const i=document.createElement('span');i.className='wv-i';i.setAttribute('aria-hidden','true');
   i.innerHTML='<svg viewBox="0 0 24 24"><path d="'+P[m[0]]+'"/></svg>';f.append(i);last=m.index+1}
  f.append(s.slice(last));n.replaceWith(f)});
}
run(document.body);
let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>run(document.body),120)}).observe(document.body,{childList:true,subtree:true});
})();
