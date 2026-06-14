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

    # Standard LinkedIn Banner Size
    target_w, target_h = 1584, 396
    
    # Remove watermark by cropping bottom 10% and right 10%
    orig_w, orig_h = img.size
    img = img.crop((0, 0, int(orig_w * 0.90), int(orig_h * 0.90)))

    # Resize and crop image to fit using ImageOps.fit
    img = ImageOps.fit(img, (target_w, target_h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))

    draw = ImageDraw.Draw(img)

    # Download fonts
    outfit_800_url = "https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-800-normal.ttf"
    font_path_star = download_font(outfit_800_url, "Outfit-ExtraBold.ttf")

    # STAR acronym text
    text_star = "S T A R"
    font_size_star = 140 # Large size for impact
    font_star = ImageFont.truetype(font_path_star, font_size_star)
    
    # Calculate width of text
    box = draw.textbbox((0, 0), text_star, font=font_star)
    text_width = box[2] - box[0]
    text_height = box[3] - box[1]

    # Vertical and Horizontal positioning (perfectly centered)
    x_star = (target_w - text_width) // 2
    y_star = (target_h - text_height) // 2 - box[1]

    # Draw STAR text in vibrant orange
    orange_color = (254, 182, 17, 255)
    draw.text((x_star, y_star), text_star, font=font_star, fill=orange_color)

    # Save
    output_path = "/Users/vanosski/Documents/Projects/Dekode/src/assets/star-acronym-banner.png"
    img.save(output_path, "PNG")
    print(f"Standard STAR acronym banner generated successfully at {output_path}!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_star_acronym.py <path_to_background_image>")
        sys.exit(1)
    generate_banner(sys.argv[1])
