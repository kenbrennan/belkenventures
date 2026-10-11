#!/usr/bin/env python3
"""Update OG/Twitter meta tags in all belken.ai HTML files."""

import re
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def og_tags(img_name, base_url="https://belken.ai"):
    url = f"{base_url}/og/{img_name}"
    return {
        "og:image": url,
        "og:image:width": "1200",
        "og:image:height": "630",
        "twitter:card": "summary_large_image",
        "twitter:image": url,
    }


GROUPS = {
    "og-belken.png": [
        "index.html",
        "public/openclaw.html",
        "public/fleet/index.html",
        "public/docs/index.html",
        "public/docs/workstation-install/index.html",
        "public/docs/workstation-troubleshooting/index.html",
        "public/privacy/index.html",
        "public/terms/index.html",
        "public/data-deletion/index.html",
        "public/field-manual/index.html",
        "public/integrations/social/tiktok/index.html",
        "public/audit/index.html",
        "public/audit/sample/index.html",
    ],
    "og-ai-receptionist.png": [
        "public/aria/index.html",
        "public/aria/electrical/index.html",
        "public/aria/hvac/index.html",
        "public/aria/law/index.html",
        "public/aria/medspa/index.html",
        "public/aria/plumbing/index.html",
        "public/aria/real-estate/index.html",
        "public/aria/roofing/index.html",
    ],
    "og-studio.png": [
        "public/studio/index.html",
    ],
    "og-compare.png": [
        "public/compare/index.html",
        "public/compare/ai-receptionist-vs-smith-ai/index.html",
        "public/compare/belken-studio-vs-opusclip/index.html",
    ],
}


def upsert_meta(html, prop_type, prop_name, content):
    """Add or update a meta tag. prop_type is 'property' or 'name'."""
    pattern = rf'<meta\s+{prop_type}="{re.escape(prop_name)}"\s+content="[^"]*"\s*/>'
    tag = f'<meta {prop_type}="{prop_name}" content="{content}" />'
    if re.search(pattern, html):
        return re.sub(pattern, tag, html)
    # Also try reversed attr order
    pattern2 = rf'<meta\s+content="[^"]*"\s+{prop_type}="{re.escape(prop_name)}"\s*/>'
    if re.search(pattern2, html):
        return re.sub(pattern2, tag, html)
    return None  # not found, need to insert


def process_file(path, img_name):
    if not os.path.exists(path):
        print(f"  SKIP (not found): {path}")
        return

    with open(path, "r", encoding="utf-8") as f:
        html = f.read()

    tags = og_tags(img_name)

    # Build meta tags to insert (those not already present)
    to_insert = []

    # og:image - property
    result = upsert_meta(html, "property", "og:image", tags["og:image"])
    if result is None:
        to_insert.append(f'<meta property="og:image" content="{tags["og:image"]}" />')
    else:
        html = result

    # og:image:width
    result = upsert_meta(html, "property", "og:image:width", tags["og:image:width"])
    if result is None:
        to_insert.append(f'<meta property="og:image:width" content="{tags["og:image:width"]}" />')
    else:
        html = result

    # og:image:height
    result = upsert_meta(html, "property", "og:image:height", tags["og:image:height"])
    if result is None:
        to_insert.append(f'<meta property="og:image:height" content="{tags["og:image:height"]}" />')
    else:
        html = result

    # twitter:card - name
    result = upsert_meta(html, "name", "twitter:card", tags["twitter:card"])
    if result is None:
        to_insert.append(f'<meta name="twitter:card" content="{tags["twitter:card"]}" />')
    else:
        html = result

    # twitter:image
    result = upsert_meta(html, "name", "twitter:image", tags["twitter:image"])
    if result is None:
        to_insert.append(f'<meta name="twitter:image" content="{tags["twitter:image"]}" />')
    else:
        html = result

    # Insert missing tags after og:description or og:title or after <head>
    if to_insert:
        insert_block = "\n".join(to_insert)
        # Try after og:description
        inserted = re.sub(
            r'(<meta\s+(?:property|name)="og:description"[^/]*/>\s*)',
            r'\1' + insert_block + '\n',
            html,
            count=1,
        )
        if inserted == html:
            # Try after og:title
            inserted = re.sub(
                r'(<meta\s+(?:property|name)="og:title"[^/]*/>\s*)',
                r'\1' + insert_block + '\n',
                html,
                count=1,
            )
        if inserted == html:
            # Try after og:type
            inserted = re.sub(
                r'(<meta\s+property="og:type"[^/]*/>\s*)',
                r'\1' + insert_block + '\n',
                html,
                count=1,
            )
        if inserted == html:
            # Fall back: after </title>
            inserted = re.sub(
                r'(</title>\s*)',
                r'\1' + insert_block + '\n',
                html,
                count=1,
            )
        html = inserted

    with open(path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"  Updated: {path}")


for img_name, files in GROUPS.items():
    print(f"\n=== {img_name} ===")
    for rel_path in files:
        full_path = os.path.join(BASE, rel_path)
        process_file(full_path, img_name)

print("\nDone.")
