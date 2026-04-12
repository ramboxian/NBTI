import urllib.request
import json
import time

ids = [436528, 436105, 436536, 437153]
urls = []

for obj_id in ids:
    try:
        url = f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{obj_id}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        data = json.loads(res.read())
        urls.append(data['primaryImageSmall'])
    except Exception as e:
        print(f"Failed ID {obj_id}: {e}")
    time.sleep(0.5)

print(urls)
