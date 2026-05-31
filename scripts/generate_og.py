import os
import urllib.request
import ssl
from PIL import Image, ImageDraw, ImageFont

def download_font():
    font_path = "/Users/vanosski/Documents/Projects/Dekode/scripts/Outfit-ExtraBold.ttf"
    if not os.path.exists(font_path):
        print("Downloading Outfit-ExtraBold.ttf font...")
        url = "https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-800-normal.ttf"
        try:
            # Bypass SSL certificate verification for python urllib
            context = ssl._create_unverified_context()
            with urllib.request.urlopen(url, context=context) as response:
                with open(font_path, "wb") as f:
                    f.write(response.read())
            print("Font downloaded successfully.")
        except Exception as e:
            print(f"Failed to download font: {e}")
            # Fallback to system font if download fails
            return "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    return font_path

def generate_og_image():
    # 1200x630 standard OG image size
    w, h = 1200, 630
    
    # Header background color: #043364 (RGB: 4, 51, 100)
    bg_color = (4, 51, 100, 255)
    img = Image.new("RGBA", (w, h), bg_color)
    draw = ImageDraw.Draw(img)

    # Use downloaded Outfit-ExtraBold font
    font_path = download_font()
    
    # Outfit-ExtraBold font size (approx 140 for premium, bold look)
    font_size = 140
    font = ImageFont.truetype(font_path, font_size)

    text = "DEKODE"
    
    # Math matching: Brand Exporter (logo-downloader.html) is letter-spacing: 4 on font-size: 90
    # Ratio = 4 / 90 = ~0.0444. For font_size 140, spacing is 140 * 0.0444 = 6px.
    char_spacing = 6
    
    # Calculate the total width of the text with spacing
    char_widths = []
    char_boxes = []
    for char in text:
        box = draw.textbbox((0, 0), char, font=font)
        char_widths.append(box[2] - box[0])
        char_boxes.append(box)
    
    total_text_width = sum(char_widths) + char_spacing * (len(text) - 1)
    max_char_height = max(box[3] - box[1] for box in char_boxes)
    
    # Starting coordinates for centered text
    x = (w - total_text_width) // 2
    # Adjust for typography box rendering offsets
    y = (h - max_char_height) // 2 - char_boxes[0][1]

    # Draw each character with custom spacing
    current_x = x
    for i, char in enumerate(text):
        draw.text((current_x - char_boxes[i][0], y), char, font=font, fill=(255, 255, 255, 255))
        current_x += char_widths[i] + char_spacing

    # Save to the public folder
    output_path = "/Users/vanosski/Documents/Projects/Dekode/public/og-image.png"
    img.save(output_path, "PNG")
    print(f"OG Image generated successfully at {output_path}!")


if __name__ == "__main__":
    generate_og_image()
