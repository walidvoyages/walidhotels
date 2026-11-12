"""Publish bilingual SEO from private Firebase RTDB. Requires Google service-account secret in GitHub Actions."""
from pathlib import Path
import os, json, re, html, urllib.request, urllib.parse, datetime
from google.oauth2 import service_account
from google.auth.transport.requests import Request
ROOT=Path(__file__).resolve().parent
DB='https://walidvoyages-13332-default-rtdb.firebaseio.com'
BASE=os.getenv('PUBLIC_SITE_URL','https://www.walidvoyages.com').rstrip('/')
assert BASE.startswith('https://')
creds_json=os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')
if not creds_json:
 raise SystemExit('ERROR: Missing FIREBASE_SERVICE_ACCOUNT_JSON GitHub secret. No SEO files updated.')
creds=service_account.Credentials.from_service_account_info(json.loads(creds_json),scopes=['https://www.googleapis.com/auth/firebase.database','https://www.googleapis.com/auth/userinfo.email'])
creds.refresh(Request())
def get(path):
 request=urllib.request.Request(DB+'/'+path+'.json',headers={'Authorization':'Bearer '+creds.token})
 with urllib.request.urlopen(request,timeout=25) as response:
  return json.load(response)
def escaped(v):return html.escape(str(v or ''),quote=True)
def canonical(file):return BASE+'/' if file=='index.html' else BASE+'/'+file
def update_meta(content,name,value):
 pattern=r'<meta\s+name=["\']'+re.escape(name)+r'["\'][^>]*>'
 tag='<meta name="'+name+'" content="'+escaped(value)+'">'
 if re.search(pattern,content,re.I):return re.sub(pattern,lambda _:tag,content,count=1,flags=re.I)
 return content.replace('</head>',tag+'</head>',1)
def render(file,record):
 path=ROOT/file
 if not path.is_file():raise RuntimeError('SEO page missing: '+file)
 content=path.read_text(encoding='utf-8')
 if record.get('title'):
  content=re.sub(r'<title\b[^>]*>.*?</title>',lambda _: '<title>'+escaped(record['title'])+'</title>',content,count=1,flags=re.I|re.S)
 if record.get('description'):content=update_meta(content,'description',record['description'])
 if record.get('ogImage') and str(record['ogImage']).startswith('https://'):
  tag='<meta property="og:image" content="'+escaped(record['ogImage'])+'">'
  if re.search(r'<meta\s+property=["\']og:image',content,re.I):content=re.sub(r'<meta\s+property=["\']og:image["\'][^>]*>',lambda _:tag,content,count=1,flags=re.I)
  else:content=content.replace('</head>',tag+'</head>',1)
 link='<link rel="canonical" href="'+escaped(canonical(file))+'">'
 content=re.sub(r'<link\s+rel=["\']canonical["\'][^>]*>', '',content,flags=re.I)
 content=content.replace('</head>',link+'</head>',1)
 path.write_text(content,encoding='utf-8')
seo=get('seo/pages') or {}
if not isinstance(seo,dict):raise RuntimeError('Firebase seo/pages format incorrect')
filenames=['index.html','ar.html','omra-tunisie.html','ar-omra-tunisie.html','hotels-tunisie.html','ar-hotels-tunisie.html','vols-tunisie.html','ar-vols-tunisie.html','voyages-organises-tunisie.html','ar-voyages-tunisie.html']
for file in filenames:
 if (ROOT/file).exists():render(file,seo.get(file.replace('.','_'),seo.get(file,{})))
# Add reciprocal hreflang and canonical links for the matching FR/AR pairs.
for fr,ar in [('index.html','ar.html'),('omra-tunisie.html','ar-omra-tunisie.html'),('hotels-tunisie.html','ar-hotels-tunisie.html'),('vols-tunisie.html','ar-vols-tunisie.html'),('voyages-organises-tunisie.html','ar-voyages-tunisie.html')]:
 for p in [ROOT/fr,ROOT/ar]:
  if not p.exists():continue
  text=p.read_text(encoding='utf-8')
  text=re.sub(r'<link\s+rel=["\']alternate["\']\s+hreflang=[^>]*>','',text,flags=re.I)
  tags=''.join(f'<link rel="alternate" hreflang="{lang}" href="{escaped(canonical(name))}">' for lang,name in [('fr-TN',fr),('ar-TN',ar)])
  p.write_text(text.replace('</head>',tags+'</head>',1),encoding='utf-8')
articles=get('articles') or {}
if not isinstance(articles,dict):raise RuntimeError('Firebase articles format incorrect')
out=ROOT/'articles';out.mkdir(exist_ok=True)
# Build the sitemap from all public HTML pages, not only editorial files.
urls=[]
for page in sorted(ROOT.glob('*.html')):
 if page.name=='admin.html':continue
 source=page.read_text(encoding='utf-8')
 if 'noindex' in source.lower().split('</head>')[0]:continue
 urls.append(canonical(page.name))
for key,record in articles.items():
 if not isinstance(record,dict) or record.get('published') is not True:continue
 slug=re.sub(r'[^a-z0-9-]','-',str(record.get('slug') or key).lower()).strip('-')[:70] or 'article'
 title=escaped(record.get('title'));desc=escaped(str(record.get('description') or '')[:160]);body=''.join('<p>'+escaped(p)+'</p>' for p in str(record.get('body') or '').splitlines() if p.strip())
 lang='ar' if record.get('lang')=='ar' else 'fr';direction='rtl' if lang=='ar' else 'ltr'
 url=BASE+'/articles/'+slug+'.html'
 doc=f'''<!doctype html><html lang="{lang}" dir="{direction}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} | Walid Voyages</title><meta name="description" content="{desc}"><link rel="canonical" href="{escaped(url)}"><style>body{{font:18px/1.8 system-ui,sans-serif;color:#14344c;background:#f6fbfe;margin:0}}header,main,footer{{max-width:860px;margin:auto;padding:26px}}h1{{font-size:clamp(30px,5vw,54px)}}main{{background:white;border-radius:22px}}</style></head><body><header><a href="{escaped(BASE+'/index.html')}">Walid Voyages</a></header><main><h1>{title}</h1><p>{desc}</p>{body}</main><footer>Walid Voyages</footer></body></html>'''
 (out/(slug+'.html')).write_text(doc,encoding='utf-8');urls.append(url)

# Hotel pages are created only for real, admin-published records.
# Google can crawl the HTML even when the live Firebase catalogue is unavailable.
hotels_data=get('hotels') or {}
if not isinstance(hotels_data,dict):raise RuntimeError('Firebase hotels format incorrect')
hotels_dir=ROOT/'hotels';hotels_dir.mkdir(exist_ok=True)
published_hotels=[]
for record in hotels_data.values():
 if not isinstance(record,dict) or record.get('published') is not True or not record.get('title'):continue
 published_hotels.append(record)
hotel_links=[]
used_slugs=set()
for record in published_hotels:
 title=str(record['title'])[:110]
 city=str(record.get('city') or 'Tunisie')[:75]
 slug=re.sub(r'[^a-z0-9]+','-',__import__('unicodedata').normalize('NFKD',title).encode('ascii','ignore').decode().lower()).strip('-')[:72]
 if not slug:continue
 if slug in used_slugs:
  print('Skipping duplicate hotel slug:',slug)
  continue
 used_slugs.add(slug)
 filename=slug+'.html'
 url=BASE+'/hotels/'+filename
 description=str(record.get('description') or '').strip()[:280]
 # Avoid automatically indexing boilerplate pages with no useful hotel information.
 if len(description)<70:
  print('Skipping hotel with insufficient description:',title)
  continue
 page_title=escaped(title+' à '+city+' | Séjour en Tunisie - Walid Hotels')
 image=str(record.get('image') or '')
 if not image.startswith('https://'):image=''
 ld={"@context":"https://schema.org","@type":"Hotel","name":title,"address":{"@type":"PostalAddress","addressLocality":city,"addressCountry":"TN"},"description":description}
 if image:ld['image']=image

 # Hotel-specific FAQ answers are published only when the admin supplies them.
 faq_items=[
  ("Quels sont les horaires d’arrivée et de départ ?",record.get("faqCheckin")),
  ("Quels services et équipements sont proposés ?",record.get("faqServices")),
  ("Quelles sont les conditions d’annulation ?",record.get("faqCancellation"))
 ]
 faq_items=[(q,str(a).strip()[:450]) for q,a in faq_items if isinstance(a,str) and a.strip()]
 faq_html='<section aria-label="Questions sur cet hôtel"><h2>Questions fréquentes sur '+escaped(title)+'</h2>'+''.join('<details><summary>'+escaped(q)+'</summary><p>'+escaped(a)+'</p></details>' for q,a in faq_items)+'</section>' if faq_items else ''
 breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Walid Hotels","item":BASE+"/"},{"@type":"ListItem","position":2,"name":title,"item":url}]}
 official_raw=str(record.get('link') or '').strip()
 official_url=official_raw if re.fullmatch(r'https://(?:www[.])?walid-voyages[.]com/details/[0-9]+/?',official_raw) else ''
 booking_search=official_url or 'https://wa.me/21658150699?'+urllib.parse.urlencode({'text':'Bonjour, je souhaite réserver '+title+' à '+city+'. Merci de me communiquer sa fiche officielle.'})
 booking_label='Voir la fiche officielle sur Walid Voyages' if official_url else 'Demander le lien officiel à Walid Voyages'
 doc='''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow"><title>'''+page_title+'''</title><meta name="description" content="'''+escaped(description[:155])+'''"><link rel="canonical" href="'''+escaped(url)+'''"><style>body{margin:0;font:17px/1.8 system-ui,sans-serif;background:#f3f9fb;color:#183c52}header,main,footer{max-width:920px;margin:auto;padding:25px}a{color:#198aba}h1{font-size:clamp(30px,5vw,53px);line-height:1.2}main{background:#fff;border-radius:20px;box-shadow:0 14px 44px #1232}img{border-radius:18px;max-height:380px;width:100%;object-fit:cover}.cta{display:inline-block;padding:12px 20px;border-radius:30px;background:#49AAE3;color:white;font-weight:bold}</style><script type="application/ld+json">'''+json.dumps(ld,ensure_ascii=False).replace('</','<\\/')+'''</script><script type="application/ld+json">'''+json.dumps(breadcrumb,ensure_ascii=False).replace('</','<\\/')+'''</script></head><body><header><a href="'''+escaped(BASE+'/')+'''">Walid Hotels · Walid Voyages</a></header><main><h1>'''+escaped(title)+'''</h1><p>Hôtel à '''+escaped(city)+''', Tunisie</p>'''+('<img src="'+escaped(image)+'" loading="lazy" alt="'+escaped(title)+'">' if image else '')+'''<p>'''+escaped(description)+'''</p>'''+faq_html+'''<p>Tarifs, caractéristiques et disponibilité à confirmer pour les dates du séjour.</p><a class="cta" href="'''+escaped(booking_search)+'''">'''+escaped(booking_label)+'''</a></main><footer>Walid Voyages • '''+escaped(city)+'''</footer></body></html>'''
 (hotels_dir/filename).write_text(doc,encoding='utf-8')
 urls.append(url)
 hotel_links.append((title,city,url))

# Add normal HTML links to hotel pages so crawlers can discover them.
listing_page=ROOT/'hotels-tunisie.html'
if listing_page.exists():
 content=listing_page.read_text(encoding='utf-8')
 content=re.sub(r'<!-- SEO_HOTEL_LINKS_START -->.*?<!-- SEO_HOTEL_LINKS_END -->','',content,flags=re.S)
 links=''.join('<li><a href="'+escaped(url)+'">'+escaped(title)+'</a> — '+escaped(city)+'</li>' for title,city,url in sorted(hotel_links,key=lambda v:(v[1].lower(),v[0].lower())))
 block='<!-- SEO_HOTEL_LINKS_START --><section class="article-block" aria-label="Hôtels référencés"><h2>Découvrir nos hôtels en Tunisie</h2><p>Consultez nos fiches. Services, tarifs et disponibilités sont à confirmer lors de la réservation.</p><ul>'+links+'</ul></section><!-- SEO_HOTEL_LINKS_END -->' if hotel_links else ''
 content=content.replace('</main>',block+'</main>',1)
 listing_page.write_text(content,encoding='utf-8')

xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('<url><loc>'+escaped(u)+'</loc></url>\n' for u in sorted(set(urls)))+'</urlset>\n'
(ROOT/'sitemap.xml').write_text(xml,encoding='utf-8')
(ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /admin.html\nSitemap: '+BASE+'/sitemap.xml\n',encoding='utf-8')
print('Published',len(filenames),'service pages +',len(urls)-len(filenames),'articles at',BASE)
