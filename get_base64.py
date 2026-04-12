import urllib.request
import base64

url = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Auguste_Rodin_-_The_Thinker_-_Cleveland_Museum_of_Art.jpg/400px-Auguste_Rodin_-_The_Thinker_-_Cleveland_Museum_of_Art.jpg"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    res = urllib.request.urlopen(req)
    img_data = res.read()
    b64 = base64.b64encode(img_data).decode('utf-8')
    with open("src/data/homeImage.ts", "w") as f:
        f.write(f"export const homeImage = 'data:image/jpeg;base64,{b64}';\n")
    print("Success, length:", len(b64))
except Exception as e:
    print("Error:", e)
