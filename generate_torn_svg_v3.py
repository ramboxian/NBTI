import random
import math

width = 2400
height = 100

points_main = []
points_fiber = []
points_curl = []

x = 0
y_base = 50

# More irregular noise function using multiple layers with varying phases
def noise(x):
    # Base wavy
    val = math.sin(x * 0.005) * 15
    # Irregular bumps
    val += math.sin(x * 0.02 + 1) * 8
    val += math.sin(x * 0.05 + 2) * 5
    val += math.sin(x * 0.1 + 3) * 3
    # Occasional sharp tears
    if math.sin(x * 0.01) > 0.8:
        val += math.sin(x * 0.2) * 10
    return val

while x <= width:
    base = y_base + noise(x)
    
    # Add high frequency jitter
    jitter_main = random.uniform(-2, 2)
    jitter_fiber = random.uniform(2, 6)
    jitter_curl = random.uniform(4, 10)
    
    y_main = base + jitter_main
    y_fiber = y_main - jitter_fiber
    y_curl = y_fiber - jitter_curl
    
    points_main.append(f"{x:.1f},{y_main:.1f}")
    points_fiber.append(f"{x:.1f},{y_fiber:.1f}")
    points_curl.append(f"{x:.1f},{y_curl:.1f}")
    
    # Variable step for more irregularity
    x += random.uniform(1, 5)

points_main_str = " ".join([f"0,{height}"] + points_main + [f"{width},{height}"])
points_fiber_str = " ".join([f"0,{height}"] + points_fiber + [f"{width},{height}"])
points_curl_str = " ".join([f"0,{height}"] + points_curl + [f"{width},{height}"])

# We use three layers:
# 1. curl (pure white #ffffff) with slight shadow
# 2. fiber (off-white #fdfbf7)
# 3. main canvas (#f4f0ea) matching bg-canvas

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" preserveAspectRatio="none" style="display:block; width:100%; height:100%;">
  <defs>
    <filter id="shadow" x="-5%" y="-50%" width="110%" height="200%">
      <feDropShadow dx="0" dy="-3" stdDeviation="5" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
    <filter id="curl-shadow" x="-5%" y="-50%" width="110%" height="200%">
      <feDropShadow dx="0" dy="-1" stdDeviation="2" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
  </defs>
  <polygon points="{points_curl_str}" fill="#ffffff" filter="url(#shadow)"/>
  <polygon points="{points_fiber_str}" fill="#fdfbf7" filter="url(#curl-shadow)"/>
  <polygon points="{points_main_str}" fill="#f4f0ea" />
</svg>'''

with open("public/torn-edge.svg", "w") as f:
    f.write(svg)

print("Generated torn-edge.svg v3")
