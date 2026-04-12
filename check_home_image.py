import urllib.request
urls = [
    "https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577083165350-14ba1d48c086?q=80&w=1000&auto=format&fit=crop",
    "https://upload.wikimedia.org/wikipedia/commons/1/1f/Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg"
]
for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5)
        print(f"OK: {url}")
    except Exception as e:
        print(f"ERROR: {url} -> {e}")
