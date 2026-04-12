import random
import math

width = 2400
height = 120

points_main = []
points_fiber = []
points_curl = []

x = 0
y_base = 60

# We'll use a random walk with momentum to create sharp, irregular tears
current_y = y_base
momentum = 0

while x <= width:
    # Change momentum occasionally
    if random.random() < 0.05:
        momentum = random.uniform(-4, 4)
    elif random.random() < 0.1:
        momentum = random.uniform(-1, 1)
        
    # Sudden large tear
    if random.random() < 0.02:
        current_y += random.uniform(-15, 15)
        momentum = 0
        
    current_y += momentum
    
    # Constrain to bounds
    if current_y < 20: current_y = 20
    if current_y > 90: current_y = 90
    
    # Add high frequency jitter
    jitter_main = random.uniform(-1.5, 1.5)
    jitter_fiber = random.uniform(2, 5)
    # The white curl is more pronounced on some edges
    jitter_curl = jitter_fiber + random.uniform(2, 6)
    
    y_main = current_y + jitter_main
    y_fiber = y_main - jitter_fiber
    y_curl = y_fiber - jitter_curl
    
    points_main.append(f"{x:.1f},{y_main:.1f}")
    points_fiber.append(f"{x:.1f},{y_fiber:.1f}")
    points_curl.append(f"{x:.1f},{y_curl:.1f}")
    
    # Variable step for more irregularity
    x += random.uniform(1, 8)

points_main_str = " ".join([f"0,{height}"] + points_main + [f"{width},{height}"])
points_fiber_str = " ".join([f"0,{height}"] + points_fiber + [f"{width},{height}"])
points_curl_str = " ".join([f"0,{height}"] + points_curl + [f"{width},{height}"])

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" preserveAspectRatio="none" style="display:block; width:100%; height:100%;">
  <defs>
    <filter id="shadow" x="-5%" y="-50%" width="110%" height="200%">
      <feDropShadow dx="0" dy="-4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <filter id="curl-shadow" x="-5%" y="-50%" width="110%" height="200%">
      <feDropShadow dx="0" dy="-1" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <polygon points="{points_curl_str}" fill="#ffffff" filter="url(#shadow)"/>
  <polygon points="{points_fiber_str}" fill="#fdfbf7" filter="url(#curl-shadow)"/>
  <polygon points="{points_main_str}" fill="#f4f0ea" />
</svg>'''

with open("public/torn-edge.svg", "w") as f:
    f.write(svg)

print("Generated torn-edge.svg v4")
