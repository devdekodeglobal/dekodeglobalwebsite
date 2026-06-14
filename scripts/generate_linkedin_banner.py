import os
import sys
import urllib.request
import ssl
from PIL import Image, ImageDraw, ImageFont, ImageOps

def download_font(url, font_name):
    font_path = f"/Users/vanosski/Documents/Projects/Dekode/scripts/{font_name}"
    if not os.path.exists(font_path):
        print(f"Downloading {font_name}...")
        try:
            # Bypass SSL certificate verification for python urllib
            context = ssl._create_unverified_context()
            with urllib.request.urlopen(url, context=context) as response:
                with open(font_path, "wb") as f:
                    f.write(response.read())
            print(f"{font_name} downloaded successfully.")
        except Exception as e:
            print(f"Failed to download font: {e}")
            return "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    return font_path

def generate_banner(bg_image_path):
    if not os.path.exists(bg_image_path):
        print(f"Error: Background image not found at {bg_image_path}")
        return

    # Open background image
    try:
        img = Image.open(bg_image_path).convert("RGBA")
    except Exception as e:
        print(f"Failed to open background image: {e}")
        return

    # High-def LinkedIn Banner Size (2x)
    target_w, target_h = 3168, 792
    
    # Remove watermark by cropping bottom 10% and right 10%
    orig_w, orig_h = img.size
    img = img.crop((0, 0, int(orig_w * 0.90), int(orig_h * 0.90)))

    # Resize and crop image to fit using ImageOps.fit
    img = ImageOps.fit(img, (target_w, target_h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))

    draw = ImageDraw.Draw(img)

    # Download fonts
    outfit_600_url = "https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-600-normal.ttf"
    font_path_star = download_font(outfit_600_url, "Outfit-SemiBold.ttf")

    # STAR text with alternating colors
    text_star_parts = [
        ("S", "orange"), ("imple ", "white"),
        ("|", "white"),
        (" ", "white"), ("T", "orange"), ("ransparent ", "white"),
        ("|", "white"),
        (" ", "white"), ("A", "orange"), ("ccountable ", "white"),
        ("|", "white"),
        (" ", "white"), ("R", "orange"), ("eliable", "white")
    ]
    font_size_star = 90
    font_star = ImageFont.truetype(font_path_star, font_size_star)
    
    # Calculate width of STAR text
    total_width_star = 0
    max_height_star = 0
    part_boxes = []
    for text_str, color in text_star_parts:
        box = draw.textbbox((0, 0), text_str, font=font_star)
        total_width_star += box[2] - box[0]
        part_boxes.append(box)
        max_height_star = max(max_height_star, box[3] - box[1])

    # Vertical positioning
    start_y = (target_h - max_height_star) // 2

    # Draw STAR text aligned to the right (with some padding)
    padding_right = 200
    x_star = target_w - total_width_star - padding_right
    y_star = start_y - part_boxes[0][1]

    current_x = x_star
    for i, (text_str, color_name) in enumerate(text_star_parts):
        fill_color = (254, 182, 17, 255) if color_name == "orange" else (255, 255, 255, 255) 
        draw.text((current_x - part_boxes[i][0], y_star), text_str, font=font_star, fill=fill_color)
        current_x += part_boxes[i][2] - part_boxes[i][0]

    # Save HD version
    output_path_hd = "/Users/vanosski/Documents/Projects/Dekode/src/assets/linkedin-banner-hd.png"
    img.save(output_path_hd, "PNG")
    print(f"High-Def LinkedIn banner generated successfully at {output_path_hd}!")

    # Generate standard size version (1584x396)
    img_standard = img.resize((1584, 396), Image.Resampling.LANCZOS)
    output_path_std = "/Users/vanosski/Documents/Projects/Dekode/src/assets/linkedin-banner-standard.png"
    img_standard.save(output_path_std, "PNG")
    print(f"Standard LinkedIn banner generated successfully at {output_path_std}!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_linkedin_banner.py <path_to_background_image>")
        print("Example: python generate_linkedin_banner.py /Users/vanosski/Downloads/hex_background.jpg")
        sys.exit(1)
    generate_banner(sys.argv[1])
