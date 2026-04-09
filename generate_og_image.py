#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFilter
import os

# Image dimensions
WIDTH = 1200
HEIGHT = 630

# Create a new image with the dark navy background
img = Image.new('RGB', (WIDTH, HEIGHT), color='#080b14')
draw = ImageDraw.Draw(img, 'RGBA')

# Create blurred circles (aurora orbs)
# Purple circle (top-left)
purple_color = (108, 78, 246, 80)  # #6c4ef6 with transparency
purple_img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
purple_draw = ImageDraw.Draw(purple_img)
# Draw a large circle
purple_draw.ellipse([50, -100, 450, 300], fill=purple_color)
# Blur it
purple_img = purple_img.filter(ImageFilter.GaussianBlur(radius=80))
# Composite onto main image
img = Image.alpha_composite(img.convert('RGBA'), purple_img).convert('RGB')

# Blue circle (bottom-right)
blue_color = (26, 140, 255, 80)  # #1a8cff with transparency
blue_img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
blue_draw = ImageDraw.Draw(blue_img)
# Draw a large circle
blue_draw.ellipse([850, 330, 1250, 730], fill=blue_color)
# Blur it
blue_img = blue_img.filter(ImageFilter.GaussianBlur(radius=80))
# Composite onto main image
img = Image.alpha_composite(img.convert('RGBA'), blue_img).convert('RGB')

# Now draw text
draw = ImageDraw.Draw(img)

# Load fonts (using default if system fonts not available)
try:
    # Try to load a bold font
    large_font = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 72)
    small_font = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 28)
except:
    # Fallback to default
    from PIL import ImageFont
    large_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

# Draw main text: "Samuel Castaneda"
main_text = "Samuel Castaneda"
# Get text bounding box to center it
bbox = draw.textbbox((0, 0), main_text, font=large_font)
text_width = bbox[2] - bbox[0]
text_x = (WIDTH - text_width) // 2
text_y = (HEIGHT // 2) - 60

draw.text((text_x, text_y), main_text, fill='white', font=large_font)

# Draw secondary text: "sam-the-man.com"
secondary_text = "sam-the-man.com"
bbox = draw.textbbox((0, 0), secondary_text, font=small_font)
text_width = bbox[2] - bbox[0]
text_x = (WIDTH - text_width) // 2
text_y = text_y + 80

draw.text((text_x, text_y), secondary_text, fill='#a78bfa', font=small_font)

# Save the image
output_dir = 'public'
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'og-image.webp')
img.save(output_path, 'WEBP', quality=90)

print(f"OG image created successfully at {output_path}")
