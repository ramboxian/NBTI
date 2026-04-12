#!/bin/bash
mkdir -p public/images

curl -s -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Le_Penseur_by_Rodin_%28Kunsthalle_Bielefeld%29_2014-04-10.JPG/800px-Le_Penseur_by_Rodin_%28Kunsthalle_Bielefeld%29_2014-04-10.JPG" -o public/images/home.jpg
sleep 1

curl -s -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/David_-_Napoleon_crossing_the_Alps_-_Malmaison2.jpg/800px-David_-_Napoleon_crossing_the_Alps_-_Malmaison2.jpg" -o public/images/p1.jpg
sleep 1

curl -s -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg/800px-Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg" -o public/images/p2.jpg
sleep 1

curl -s -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg" -o public/images/p3.jpg
sleep 1

curl -s -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg" -o public/images/p4.jpg
sleep 1

curl -s -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Death_of_Marat_by_David.jpg/800px-Death_of_Marat_by_David.jpg" -o public/images/p6.jpg
sleep 1

curl -s -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/800px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg" -o public/images/p7.jpg
sleep 1

curl -s -A "Mozilla/5.0" "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg" -o public/images/p8.jpg

ls -lh public/images/*.jpg
