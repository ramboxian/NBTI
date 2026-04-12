#!/bin/bash
curl -s -L "https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=1000&auto=format&fit=crop" -o public/images/home.jpg
curl -s -L "https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?q=80&w=1000&auto=format&fit=crop" -o public/images/p1.jpg
curl -s -L "https://images.unsplash.com/photo-1578305922253-157771e3d36b?q=80&w=1000&auto=format&fit=crop" -o public/images/p2.jpg
curl -s -L "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=1000&auto=format&fit=crop" -o public/images/p3.jpg
curl -s -L "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1000&auto=format&fit=crop" -o public/images/p4.jpg
curl -s -L "https://images.unsplash.com/photo-1577083165350-14ba1d48c086?q=80&w=1000&auto=format&fit=crop" -o public/images/p5.jpg
curl -s -L "https://images.unsplash.com/photo-1518998053401-b3b3a628d0eb?q=80&w=1000&auto=format&fit=crop" -o public/images/p6.jpg
curl -s -L "https://images.unsplash.com/photo-1576769267415-9642010aa962?q=80&w=1000&auto=format&fit=crop" -o public/images/p7.jpg
curl -s -L "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop" -o public/images/p8.jpg

ls -lh public/images/*.jpg
