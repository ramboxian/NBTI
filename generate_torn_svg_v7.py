import random
import math

width = 2400
height = 160 # Increase total height slightly to allow for larger vertical drops

points_main = []
points_fiber = []
points_curl = []

x = 0
y_base = 80

current_y = y_base
momentum = 0

random.seed(123) # Use a specific seed to find a good pattern

while x <= width:
    # 1. Large structural changes (High amplitude, low frequency)
    if random.random() < 0.04:
        # Give it a strong push up or down
        momentum = random.uniform(-8, 8)
    elif random.random() < 0.08:
        # Gentle push
        momentum = random.uniform(-2, 2)
        
    # 2. Sudden, massive, but rare tearing drops (Big step)
    if random.random() < 0.015:
        # Jump by 15-30 pixels instantly
        current_y += random.choice([-1, 1]) * random.uniform(15, 30)
        momentum = 0
        
    # Apply momentum to current Y
    current_y += momentum
    
    # 3. Apply soft clamping to keep it within bounds without harsh cuts
    if current_y < 20: 
        current_y = 20
        momentum = abs(momentum) * 0.5 # bounce back softly
    if current_y > 130: 
        current_y = 130
        momentum = -abs(momentum) * 0.5
    
    # 4. Small, blunt variations (No sharp teeth)
    # Keep the high-frequency jitter very low
    jitter_main = random.uniform(-1, 1)
    
    # 5. Thick white curl/fiber layers to make it look like thick paper
    jitter_curl = random.uniform(4, 12)
    jitter_fiber = random.uniform(2, jitter_curl - 2)
    
    y_main = current_y + jitter_main
    y_fiber = y_main - jitter_fiber
    y_curl = y_main - jitter_curl
    
    points_main.append(f"{x:.1f},{y_main:.1f}")
    points_fiber.append(f"{x:.1f},{y_fiber:.1f}")
    points_curl.append(f"{x:.1f},{y_curl:.1f}")
    
    # Step size: larger steps = blunter edges, smaller steps = sharper teeth
    # We keep it medium-large to avoid the "fine comb" look
    x += random.uniform(5, 15)

points_main_str = " ".join([f"0,{height}"] + points_main + [f"{width},{height}"])
points_fiber_str = " ".join([f"0,{height}"] + points_fiber + [f"{width},{height}"])
points_curl_str = " ".join([f"0,{height}"] + points_curl + [f"{width},{height}"])

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" preserveAspectRatio="none" style="display:block; width:100%; height:100%;">
  <defs>
    <filter id="shadow" x="-5%" y="-50%" width="110%" height="200%">
      <feDropShadow dx="0" dy="-4" stdDeviation="5" flood-color="#000000" flood-opacity="0.75"/>
    </filter>
    <filter id="curl-shadow" x="-5%" y="-50%" width="110%" height="200%">
      <feDropShadow dx="0" dy="-1" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <polygon points="{points_curl_str}" fill="#faf8f5" filter="url(#shadow)"/>
  <polygon points="{points_fiber_str}" fill="#f5f2eb" filter="url(#curl-shadow)"/>
  <polygon points="{points_main_str}" fill="#f0ebe1" />
</svg>'''

with open("public/torn-edge.svg", "w") as f:
    f.write(svg)

print("Generated torn-edge.svg v7 (Large drops, blunt edges)")
