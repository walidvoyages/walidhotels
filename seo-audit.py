"""Pre-deployment SEO checks for Walid Voyages static pages."""
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

root = Path(__file__).resolve().parent
errors = []
sitemap = root / "sitemap.xml"
if not sitemap.exists():
    errors.append("Missing sitemap.xml")
else:
    try:
        tree = ET.parse(sitemap)
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [n.text for n in tree.findall(".//s:loc", ns)]
        if not urls:
            errors.append("Sitemap has no URLs")
        if len(urls) != len(set(urls)):
            errors.append("Sitemap contains duplicate URLs")
        for url in urls:
            parsed = urlparse(url or "")
            if parsed.scheme != "https" or parsed.netloc != "www.walidvoyages.com":
                errors.append("Unexpected sitemap URL: " + str(url))
                continue
            p = parsed.path.lstrip("/")
            local = root / (p or "index.html")
            if not local.is_file():
                errors.append("Sitemap URL missing local file: " + str(url))
                continue
            html = local.read_text(encoding="utf-8")
            head = html.split("</head>")[0].lower()
            if "noindex" in head:
                errors.append("Noindex URL included in sitemap: " + str(url))
            if not re.search(r"<title\b[^>]*>\s*[^<]+", html, re.I):
                errors.append("Missing SEO title: " + str(url))
            if not re.search(r'<link\s+rel=["\']canonical["\']', html, re.I):
                errors.append("Missing canonical: " + str(url))
    except (ET.ParseError, OSError) as exc:
        errors.append("Invalid sitemap: " + str(exc))

if errors:
    for issue in errors:
        print("ERROR:", issue)
    sys.exit(1)
print("SEO validation passed: sitemap, canonicals, titles, public pages")
