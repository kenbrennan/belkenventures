#!/usr/bin/env python3
"""Generate 4 OG preview images for belken.ai"""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
MARGIN = 60
BG = (10, 15, 26)          # #0a0f1a
WHITE = (255, 255, 255)
BLUE = (96, 139, 251)       # #608bfb
PURPLE = (167, 139, 250)    # #a78bfa
MUTED = (160, 170, 190)     # subdued text

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG  = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

OUTDIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "og")
os.makedirs(OUTDIR, exist_ok=True)

FoL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "favicon-512.png")


def make_base(accent_color=BLUE):
    img = Image.new("RGBA", (W, H), (*BG, 255))
    draw = ImageDraw.Draw(img)

    # Subtle radial gradient blob top-right
    blob = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(blob)
    for r in range(300, 0, -1):
        alpha = int(55 * (1 - r / 300))
        bdraw.ellipse([W - r - 60, -r // 2, W + r - 60, r], fill=(*accent_color, alpha))
    img = Image.alpha_composite(img, blob)

    # Thin horizontal rule near bottom
    draw2 = ImageDraw.Draw(img)
    draw2.line([(MARGIN, H - 100), (W - MARGIN, H - 100)], fill=(255, 255, 255, 30), width=1)

    return img


def place_fol(img, x, y, size=140, opacity=55):
    """Composite the Flower of Life mark semi-transparently."""
    fol = Image.open(FoL_PATH).convert("RGBA")
    fol = fol.resize((size, size), Image.LANCZOS)
    # Reduce opacity
    r, g, b, a = fol.split()
    a = a.point(lambda p: int(p * opacity / 255))
    fol = Image.merge("RGBA", (r, g, b, a))
    img.paste(fol, (x, y), fol)


def place_fol_large(img, x, y, size=320, opacity=30):
    """Large decorative FoL on right side."""
    fol = Image.open(FoL_PATH).convert("RGBA")
    fol = fol.resize((size, size), Image.LANCZOS)
    r, g, b, a = fol.split()
    a = a.point(lambda p: int(p * opacity / 255))
    fol = Image.merge("RGBA", (r, g, b, a))
    img.paste(fol, (x, y), fol)


def wrap_text(draw, text, font, max_width):
    """Return list of lines that fit within max_width."""
    words = text.split()
    lines = []
    current = []
    for word in words:
        test = " ".join(current + [word])
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] > max_width and current:
            lines.append(" ".join(current))
            current = [word]
        else:
            current.append(word)
    if current:
        lines.append(" ".join(current))
    return lines


def draw_label(draw, text, x, y, font, color=WHITE):
    draw.text((x, y), text, font=font, fill=color)
    bbox = draw.textbbox((x, y), text, font=font)
    return bbox[3]  # bottom y


def gen_home():
    img = make_base(BLUE)
    draw = ImageDraw.Draw(img)

    # Large decorative FoL right side
    place_fol_large(img, W - 350, H // 2 - 160, size=320, opacity=28)
    # Small FoL near wordmark
    place_fol(img, MARGIN, MARGIN + 4, size=52, opacity=180)

    f_word = ImageFont.truetype(FONT_BOLD, 52)
    f_title = ImageFont.truetype(FONT_BOLD, 72)
    f_sub = ImageFont.truetype(FONT_REG, 28)
    f_tag = ImageFont.truetype(FONT_BOLD, 22)

    # Wordmark
    draw.text((MARGIN + 62, MARGIN + 12), "Belken", font=f_word, fill=WHITE)

    # Tag line
    draw.text((MARGIN, MARGIN + 80), "Autonomous Operations", font=f_tag, fill=MUTED)

    # Main title - two lines
    title_y = 210
    draw.text((MARGIN, title_y), "We build and run", font=f_title, fill=WHITE)
    draw.text((MARGIN, title_y + 82), "your operations layer.", font=f_title, fill=(*BLUE, 255))

    # Sub line
    sub = "Missed calls, follow-ups, scheduling, reviews, and reactivation. Around the clock."
    text_w = W - MARGIN * 2 - 320
    lines = wrap_text(draw, sub, f_sub, text_w)
    sub_y = title_y + 82 + 80
    for line in lines[:2]:
        draw.text((MARGIN, sub_y), line, font=f_sub, fill=MUTED)
        sub_y += 38

    # Domain
    f_dom = ImageFont.truetype(FONT_BOLD, 20)
    draw.text((MARGIN, H - 72), "belken.ai", font=f_dom, fill=(*BLUE, 200))

    out = os.path.join(OUTDIR, "og-belken.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"Saved {out}")


def gen_aria():
    img = make_base(PURPLE)
    draw = ImageDraw.Draw(img)

    place_fol_large(img, W - 340, H // 2 - 155, size=310, opacity=28)
    place_fol(img, MARGIN, MARGIN + 4, size=52, opacity=180)

    f_word = ImageFont.truetype(FONT_BOLD, 52)
    f_title = ImageFont.truetype(FONT_BOLD, 68)
    f_sub = ImageFont.truetype(FONT_REG, 28)
    f_tag = ImageFont.truetype(FONT_BOLD, 22)

    draw.text((MARGIN + 62, MARGIN + 12), "Belken", font=f_word, fill=WHITE)
    draw.text((MARGIN, MARGIN + 80), "AI Receptionist", font=f_tag, fill=MUTED)

    title_y = 210
    draw.text((MARGIN, title_y), "AI Receptionist,", font=f_title, fill=WHITE)
    draw.text((MARGIN, title_y + 78), "ready for the trades.", font=f_title, fill=(*PURPLE, 255))

    sub = "Answers every call 24/7. Texts missed callers back in about 60 seconds."
    text_w = W - MARGIN * 2 - 310
    lines = wrap_text(draw, sub, f_sub, text_w)
    sub_y = title_y + 78 + 80
    for line in lines[:2]:
        draw.text((MARGIN, sub_y), line, font=f_sub, fill=MUTED)
        sub_y += 38

    f_dom = ImageFont.truetype(FONT_BOLD, 20)
    draw.text((MARGIN, H - 72), "belken.ai/aria", font=f_dom, fill=(*PURPLE, 200))

    out = os.path.join(OUTDIR, "og-ai-receptionist.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"Saved {out}")


def gen_studio():
    img = make_base((100, 200, 130))  # greenish accent
    draw = ImageDraw.Draw(img)

    # Try to load step-generate.jpg from studio/img
    studio_img_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "studio", "img", "step-generate.jpg")
    if os.path.exists(studio_img_path):
        try:
            sc = Image.open(studio_img_path).convert("RGBA")
            # Crop to right portion, fit into ~420x350 on the right
            right_w = 400
            ratio = right_w / sc.width
            sc = sc.resize((right_w, int(sc.height * ratio)), Image.LANCZOS)
            sc_h = min(sc.height, H - 2 * MARGIN)
            sc = sc.crop((0, 0, right_w, sc_h))
            # Add soft left fade
            fade = Image.new("RGBA", sc.size, (0, 0, 0, 0))
            fdraw = ImageDraw.Draw(fade)
            for xi in range(100):
                alpha = int(255 * (1 - xi / 100))
                fdraw.line([(xi, 0), (xi, sc_h)], fill=(10, 15, 26, alpha))
            sc = Image.alpha_composite(sc, fade)
            img.paste(sc, (W - right_w, (H - sc_h) // 2), sc)
        except Exception as e:
            print(f"  studio screenshot load failed: {e}")

    place_fol(img, MARGIN, MARGIN + 4, size=52, opacity=180)

    f_word = ImageFont.truetype(FONT_BOLD, 52)
    f_title = ImageFont.truetype(FONT_BOLD, 64)
    f_sub = ImageFont.truetype(FONT_REG, 28)
    f_tag = ImageFont.truetype(FONT_BOLD, 22)

    STUDIO_GREEN = (100, 220, 150)
    draw.text((MARGIN + 62, MARGIN + 12), "Belken", font=f_word, fill=WHITE)
    draw.text((MARGIN, MARGIN + 80), "Belken Studio", font=f_tag, fill=MUTED)

    title_y = 200
    draw.text((MARGIN, title_y), "Paste a script.", font=f_title, fill=WHITE)
    draw.text((MARGIN, title_y + 74), "Hit one button.", font=f_title, fill=(*STUDIO_GREEN, 255))

    sub = "Turns a script into a short-form video with your avatar. Runs in your browser."
    text_w = W - MARGIN * 2 - 420
    lines = wrap_text(draw, sub, f_sub, text_w)
    sub_y = title_y + 74 + 78
    for line in lines[:2]:
        draw.text((MARGIN, sub_y), line, font=f_sub, fill=MUTED)
        sub_y += 38

    f_dom = ImageFont.truetype(FONT_BOLD, 20)
    draw.text((MARGIN, H - 72), "belken.ai/studio", font=f_dom, fill=(*STUDIO_GREEN, 200))

    out = os.path.join(OUTDIR, "og-studio.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"Saved {out}")


def gen_compare():
    img = make_base((251, 191, 36))  # amber accent
    draw = ImageDraw.Draw(img)

    place_fol_large(img, W - 340, H // 2 - 155, size=310, opacity=28)
    place_fol(img, MARGIN, MARGIN + 4, size=52, opacity=180)

    f_word = ImageFont.truetype(FONT_BOLD, 52)
    f_title = ImageFont.truetype(FONT_BOLD, 72)
    f_sub = ImageFont.truetype(FONT_REG, 28)
    f_tag = ImageFont.truetype(FONT_BOLD, 22)

    AMBER = (251, 191, 36)
    draw.text((MARGIN + 62, MARGIN + 12), "Belken", font=f_word, fill=WHITE)
    draw.text((MARGIN, MARGIN + 80), "Side-by-side comparisons", font=f_tag, fill=MUTED)

    title_y = 210
    draw.text((MARGIN, title_y), "Honest", font=f_title, fill=WHITE)
    draw.text((MARGIN, title_y + 82), "comparisons.", font=f_title, fill=(*AMBER, 255))

    sub = "Source-backed comparisons of Belken products against the tools people weigh them against."
    text_w = W - MARGIN * 2 - 310
    lines = wrap_text(draw, sub, f_sub, text_w)
    sub_y = title_y + 82 + 80
    for line in lines[:2]:
        draw.text((MARGIN, sub_y), line, font=f_sub, fill=MUTED)
        sub_y += 38

    f_dom = ImageFont.truetype(FONT_BOLD, 20)
    draw.text((MARGIN, H - 72), "belken.ai/compare", font=f_dom, fill=(*AMBER, 200))

    out = os.path.join(OUTDIR, "og-compare.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"Saved {out}")


if __name__ == "__main__":
    gen_home()
    gen_aria()
    gen_studio()
    gen_compare()
    print("All 4 OG images generated.")
