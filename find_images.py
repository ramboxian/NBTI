import urllib.request
import json

def get_wiki_image(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&pithumbsize=1000"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5)
        data = json.loads(res.read())
        pages = data['query']['pages']
        for page_id in pages:
            if 'thumbnail' in pages[page_id]:
                return pages[page_id]['thumbnail']['source']
    except Exception as e:
        return str(e)
    return None

print("Gleaners:", get_wiki_image("The_Gleaners"))
print("The Thinker:", get_wiki_image("The_Thinker"))
print("Death of Marat:", get_wiki_image("The_Death_of_Marat"))
print("Mona Lisa:", get_wiki_image("Mona_Lisa"))
print("Starry Night:", get_wiki_image("The_Starry_Night"))
print("Creation of Adam:", get_wiki_image("The_Creation_of_Adam"))
print("The Scream:", get_wiki_image("The_Scream"))
print("Napoleon:", get_wiki_image("Napoleon_Crossing_the_Alps"))
