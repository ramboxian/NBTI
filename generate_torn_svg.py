import random

width = 2400
height = 60

# We want the paper to be at the bottom, so the points go from left to right, then down to bottom right, then bottom left.
# Wait, the video is AT THE TOP. The canvas is AT THE BOTTOM.
# So the canvas (paper) covers the bottom of the video.
# The jagged edge is the TOP edge of the canvas.
# Y=0 is top, Y=height is bottom.
# The paper fills from the jagged edge down to Y=height.

points_main = ["0,60"]
points_fiber = ["0,60"]

x = 0
y_base = 30

# We'll use a fractal noise / random walk for the jagged edge
def noise(x):
    # simple sine wave mix
    import math
    return math.sin(x * 0.05) * 5 + math.sin(x * 0.1) * 3 + math.sin(x * 0.5) * 2

while x <= width:
    # y = base + noise + random jitter
    y_main = y_base + noise(x) + random.uniform(-2, 2)
    # The fiber is slightly above the main edge (smaller Y)
    y_fiber = y_main - random.uniform(1, 4)
    
    points_main.append(f"{x:.1f},{y_main:.1f}")
    points_fiber.append(f"{x:.1f},{y_fiber:.1f}")
    
    x += random.uniform(1, 3)

points_main.extend([f"{width},60"])
points_fiber.extend([f"{width},60"])

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" preserveAspectRatio="none" style="display:block; width:100%; height:100%;">
  <defs>
    <filter id="shadow" x="-2%" y="-50%" width="104%" height="200%">
      <feDropShadow dx="0" dy="-2" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <polygon points="{" ".join(points_fiber)}" fill="#ffffff" filter="url(#shadow)"/>
  <polygon points="{" ".join(points_main)}" fill="#e2dfd8" />
</svg>'''

with open("public/torn-edge.svg", "w") as f:
    f.write(svg)

print("Generated torn-edge.svg")
