"""Publish bilingual SEO from private Firebase RTDB. Requires Google service-account secret in GitHub Actions."""
from pathlib import Path
import os, json, re, html, urllib.request, urllib.parse, datetime
from google.oauth2 import service_account
from google.auth.transport.requests import Request
ROOT=Path(__file__).resolve().parent
DB='https://walidvoyages-13332-default-rtdb.firebaseio.com'
BASE=os.getenv('PUBLIC_SITE_URL','https://walidvoyages.github.io/walidvoyagessite').rstrip('/')
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
def canonical(file):return BASE+'/'+file
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
urls=[canonical(f) for f in filenames if (ROOT/f).exists()]
for key,record in articles.items():
 if not isinstance(record,dict) or record.get('published') is not True:continue
 slug=re.sub(r'[^a-z0-9-]','-',str(record.get('slug') or key).lower()).strip('-')[:70] or 'article'
 title=escaped(record.get('title'));desc=escaped(str(record.get('description') or '')[:160]);body=''.join('<p>'+escaped(p)+'</p>' for p in str(record.get('body') or '').splitlines() if p.strip())
 lang='ar' if record.get('lang')=='ar' else 'fr';direction='rtl' if lang=='ar' else 'ltr'
 url=BASE+'/articles/'+slug+'.html'
 doc=f'''<!doctype html><html lang="{lang}" dir="{direction}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} | Walid Voyages</title><meta name="description" content="{desc}"><link rel="canonical" href="{escaped(url)}"><style>body{{font:18px/1.8 system-ui,sans-serif;color:#14344c;background:#f6fbfe;margin:0}}header,main,footer{{max-width:860px;margin:auto;padding:26px}}h1{{font-size:clamp(30px,5vw,54px)}}main{{background:white;border-radius:22px}}</style></head><body><header><a href="{escaped(BASE+'/index.html')}">Walid Voyages</a></header><main><h1>{title}</h1><p>{desc}</p>{body}</main><footer>Walid Voyages</footer></body></html>'''
 (out/(slug+'.html')).write_text(doc,encoding='utf-8');urls.append(url)
xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('<url><loc>'+escaped(u)+'</loc></url>\n' for u in sorted(set(urls)))+'</urlset>\n'
(ROOT/'sitemap.xml').write_text(xml,encoding='utf-8')
(ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /admin.html\nSitemap: '+BASE+'/sitemap.xml\n',encoding='utf-8')
print('Published',len(filenames),'service pages +',len(urls)-len(filenames),'articles at',BASE)
