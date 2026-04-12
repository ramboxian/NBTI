import random
import math

width = 2400
height = 120

points_main = []
points_fiber = []
points_curl = []

x = 0
y_base = 60

current_y = y_base
momentum = 0

random.seed(42)

while x <= width:
    # Less frequent momentum changes, larger smoother curves
    if random.random() < 0.03:
        momentum = random.uniform(-3, 3)
    elif random.random() < 0.08:
        momentum = random.uniform(-0.5, 0.5)
        
    # Less frequent sudden tears, and less drastic
    if random.random() < 0.01:
        current_y += random.uniform(-10, 10)
        momentum = 0
        
    current_y += momentum
    
    if current_y < 30: current_y = 30
    if current_y > 90: current_y = 90
    
    # Very small jitter for less "sharp teeth"
    jitter_main = random.uniform(-0.5, 0.5)
    
    # White curl layer is still pronounced but less spiky
    jitter_curl = random.uniform(3, 8)
    jitter_fiber = random.uniform(1, jitter_curl - 1)
    
    y_main = current_y + jitter_main
    y_fiber = y_main - jitter_fiber
    y_curl = y_main - jitter_curl
    
    points_main.append(f"{x:.1f},{y_main:.1f}")
    points_fiber.append(f"{x:.1f},{y_fiber:.1f}")
    points_curl.append(f"{x:.1f},{y_curl:.1f}")
    
    # Larger steps mean fewer points, which means smoother, less jagged edges
    x += random.uniform(4, 15)

points_main_str = " ".join([f"0,{height}"] + points_main + [f"{width},{height}"])
points_fiber_str = " ".join([f"0,{height}"] + points_fiber + [f"{width},{height}"])
points_curl_str = " ".join([f"0,{height}"] + points_curl + [f"{width},{height}"])

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" preserveAspectRatio="none" style="display:block; width:100%; height:100%;">
  <defs>
    <filter id="shadow" x="-5%" y="-50%" width="110%" height="200%">
      <feDropShadow dx="0" dy="-3" stdDeviation="4" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
    <filter id="curl-shadow" x="-5%" y="-50%" width="110%" height="200%">
      <feDropShadow dx="0" dy="-1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <polygon points="{points_curl_str}" fill="#ffffff" filter="url(#shadow)"/>
  <polygon points="{points_fiber_str}" fill="#fdfbf7" filter="url(#curl-shadow)"/>
  <polygon points="{points_main_str}" fill="#f4f0ea" />
</svg>'''

with open("public/torn-edge.svg", "w") as f:
    f.write(svg)

print("Generated torn-edge.svg v6 (Smoother)")
