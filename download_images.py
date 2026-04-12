import urllib.request
import os
import time

images = {
    "home.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Le_Penseur_by_Rodin_%28Kunsthalle_Bielefeld%29_2014-04-10.JPG/800px-Le_Penseur_by_Rodin_%28Kunsthalle_Bielefeld%29_2014-04-10.JPG",
    "p1.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/David_-_Napoleon_crossing_the_Alps_-_Malmaison2.jpg/800px-David_-_Napoleon_crossing_the_Alps_-_Malmaison2.jpg",
    "p2.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg/800px-Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg",
    "p4.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    "p6.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Death_of_Marat_by_David.jpg/800px-Death_of_Marat_by_David.jpg",
    "p7.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/800px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
    "p8.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg"
}

opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36')]
urllib.request.install_opener(opener)

for name, url in images.items():
    path = os.path.join("public/images", name)
    try:
        urllib.request.urlretrieve(url, path)
        print(f"Downloaded {name}")
        time.sleep(2)
    except Exception as e:
        print(f"Failed {name}: {e}")
