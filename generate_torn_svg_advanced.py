import random
import math

width = 2400
height = 60

points_main = []
points_fiber = []

x = 0
y_base = 30

def perlin_like(x):
    return sum(math.sin(x * (0.01 * (2**i))) * (15 / (2**i)) for i in range(5))

while x <= width:
    base = y_base + perlin_like(x)
    # Add high frequency noise
    jitter_main = random.uniform(-1.5, 1.5)
    jitter_fiber = random.uniform(1, 3) + random.uniform(0, 1.5)
    
    y_main = base + jitter_main
    y_fiber = y_main - jitter_fiber
    
    points_main.append(f"{x:.1f},{y_main:.1f}")
    points_fiber.append(f"{x:.1f},{y_fiber:.1f}")
    
    x += random.uniform(1, 4)

points_main_str = " ".join([f"0,{height}"] + points_main + [f"{width},{height}"])
points_fiber_str = " ".join([f"0,{height}"] + points_fiber + [f"{width},{height}"])

# We use two layers: one white (fiber) with shadow, one canvas color (main).
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" preserveAspectRatio="none" style="display:block; width:100%; height:100%;">
  <defs>
    <filter id="shadow" x="-5%" y="-50%" width="110%" height="200%">
      <feDropShadow dx="0" dy="-2" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <polygon points="{points_fiber_str}" fill="#fdfbf7" filter="url(#shadow)"/>
  <polygon points="{points_main_str}" fill="#e2dfd8" />
</svg>'''

with open("public/torn-edge.svg", "w") as f:
    f.write(svg)

print("Generated advanced torn-edge.svg")
