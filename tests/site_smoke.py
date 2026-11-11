"""Static smoke check for MyPortfolio R1.6 WP2. No browser/device claims."""
from pathlib import Path
import re
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
s = (root / "index.html").read_text(encoding="utf-8")
config = root / "published-config.js"
logo = root / "images" / "ASCuarium.ico"
checks = {
    "Accessibility-only public settings": len(re.findall(r'<details\b[^>]*class="settings-group"', s)) == 1,
    "portrait position and zoom": all(f'id="{x}"' in s for x in ("portrait-x-range", "portrait-range", "portrait-zoom-range")),
    "Developer media manager": all(f'id="{x}"' in s for x in ("dev-projects-media", "media-upload", "media-export")),
    "Undo/Redo/revert": all(f'id="{x}"' in s for x in ("settings-undo", "settings-redo", "settings-last-saved")),
    "authentic aquarium artwork": "ASCuarium — official fish-and-coral icon supplied by site owner" in s and logo.is_file() and logo.stat().st_size > 10000,
    "contact SVG icons": all(f'id="contact-{x}"' in s for x in ("discord", "steam")) and s.count('class="contact-glyph"') == 4,
    "carousel audio controls": all(f'id="{x}"' in s for x in ("carousel-audio-enable", "carousel-audio-volume", "carousel-audio-preview", "carousel-audio-file")),
    "phone-editable config": config.is_file() and '<script src="published-config.js"></script>' in s,
    "removed redundant footer": "Dor Mandel · Software engineering, games, tools and design" not in s,
    "clean ASCuarium cover": "record-label{display:none}" in s,
    "adaptive confetti": "lowPower?46:94" in s and "slowFrames>9" in s,
}
for name, passed in checks.items():
    print(("PASS" if passed else "FAIL") + ": " + name)
sources = [x for x in re.findall(r"<script\b[^>]*>(.*?)</script>", s, re.S | re.I) if x.strip()]
if len(sources) != 7:
    sys.exit(f"FAIL: expected 7 inline scripts, found {len(sources)}")
for n, src in enumerate(sources, 1):
    result = subprocess.run(["node", "--check", "-"], input=src, text=True, capture_output=True)
    if result.returncode:
        sys.exit(f"FAIL: script {n}: {result.stderr}")
print("PASS: all 7 embedded JavaScript blocks parse")
result = subprocess.run(["node", "--check", str(config)], capture_output=True, text=True)
if result.returncode:
    sys.exit(f"FAIL: published config syntax: {result.stderr}")
print("PASS: published-config.js parses")
if not all(checks.values()):
    sys.exit("FAIL: static smoke assertions")
print("PASS: R1.6 WP2 static smoke. Live browser and Samsung QA still required.")
