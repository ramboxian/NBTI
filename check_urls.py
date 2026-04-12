import urllib.request
import re

with open('src/data/results.ts', 'r') as f:
    content = f.read()

urls = re.findall(r"paintingUrl:\s*'(https?://[^\']+)'", content)

for url in urls:
    try:
        req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5)
        print(f"OK: {res.status} - {url}")
    except Exception as e:
        print(f"ERROR: {e} - {url}")

