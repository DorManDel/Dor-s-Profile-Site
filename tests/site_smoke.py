"""Static smoke check for MyPortfolio R1.6 WP3. No browser/device claims."""
from pathlib import Path
import re
import base64
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
s = (root / "index.html").read_text(encoding="utf-8")
config = root / "published-config.js"
logo = root / "images" / "ASCuarium.ico"
wslx_svg = root / "images" / "wslx-logo.svg"
wslx_embed = re.search(r"\{id:'wslx'[^\n]*?logo:'data:image/svg\+xml;base64,([^']+)'", s)
wslx_is_official = bool(wslx_svg.is_file() and wslx_embed and base64.b64decode(wslx_embed.group(1)) == wslx_svg.read_bytes())
checks = {
    "Accessibility-only public settings": len(re.findall(r'<details\b[^>]*class="settings-group"', s)) == 1,
    "portrait position and zoom": all(f'id="{x}"' in s for x in ("portrait-x-range", "portrait-range", "portrait-zoom-range")),
    "Developer media manager": all(f'id="{x}"' in s for x in ("dev-projects-media", "media-upload", "media-export")),
    "Undo/Redo/revert": all(f'id="{x}"' in s for x in ("settings-undo", "settings-redo", "settings-last-saved")),
    "authentic aquarium artwork": "ASCuarium — official fish-and-coral icon supplied by site owner" in s and logo.is_file() and logo.stat().st_size > 10000,
    "contact SVG icons": all(f'id="contact-{x}"' in s for x in ("discord", "steam")) and s.count('class="contact-glyph"') == 4,
    "carousel audio controls": all(f'id="{x}"' in s for x in ("carousel-audio-enable", "carousel-audio-volume", "carousel-audio-preview", "carousel-audio-file")),
    "position-driven Ratchet V3": (root / "js/carousel-ratchet-v3.js").is_file() and
        'js/carousel-ratchet-v3.js?v=1' in s and
        'window.PortfolioCarouselAudio?.update({position:state.position,velocity:state.velocity})' in s,
    "phone-editable config": config.is_file() and '<script src="published-config.js"></script>' in s,
    "real social destinations": 'https://steamcommunity.com/id/Bh0pexe/' in s and 'https://discord.com/users/711943737949028432' in s,
    "Developer Search": all(f'id="{x}"' in s for x in ("wp3-search","wp3-ripple-settings","wp3-prism-settings","wp3-haptics-settings","wp3-diagnostics")),
    "disabled by default Ripple and Prism": all(f'id="{x}"' in s for x in ("wp3-ripple","wp3-prism")) and
        'id="wp3-ripple" checked' not in s and 'id="wp3-prism" checked' not in s,
    "FPS and mobile lens": 'wp3-fps' in s and (root / "css/wp3-fx.css").is_file(),
    "WaterRipple V2 asset": (root / "js/water-ripple-v2.js").is_file() and 'js/water-ripple-v2.js?v=1' in s,
    "bundled Spin-09 cue": (root / "audio/spin-09-click.mp3").is_file() and
        (root / "audio/spin-09-click.mp3").read_bytes().startswith(b"ID3") and
        'value="spin09"' in s and 'carousel-audio-clicks' in s,
    "owner-supplied WSLX artwork": wslx_is_official and
        "src:window.WORK_PROJECTS?.find(p=>p.id==='wslx')?.logo||'images/wslx-logo.svg'" in s and
        not re.search(r"\{id:'wslx'[^\n]*src:'data:image/svg\+xml;base64,", s),
    "removed redundant footer": "Dor Mandel · Software engineering, games, tools and design" not in s,
    "clean ASCuarium cover": "record-label{display:none}" in s,
    "adaptive confetti": "lowPower?46:94" in s and "slowFrames>9" in s,
}
for name, passed in checks.items():
    print(("PASS" if passed else "FAIL") + ": " + name)
sources = [x for x in re.findall(r"<script\b[^>]*>(.*?)</script>", s, re.S | re.I) if x.strip()]
if len(sources) != 6:
    sys.exit(f"FAIL: expected 6 inline scripts, found {len(sources)}")
for n, src in enumerate(sources, 1):
    result = subprocess.run(["node", "--check", "-"], input=src, text=True, capture_output=True)
    if result.returncode:
        sys.exit(f"FAIL: script {n}: {result.stderr}")
print("PASS: all 6 embedded JavaScript blocks parse")
result = subprocess.run(["node", "--check", str(config)], capture_output=True, text=True)
if result.returncode:
    sys.exit(f"FAIL: published config syntax: {result.stderr}")
print("PASS: published-config.js parses")
for name in ("js/water-ripple-v2.js", "js/wp3-enhancements.js", "js/carousel-ratchet-v3.js"):
    f = root / name
    result = subprocess.run(["node", "--check", str(f)], capture_output=True, text=True)
    if result.returncode:
        sys.exit(f"FAIL: {name} syntax: {result.stderr}")
    print("PASS: " + name + " parses")
if not all(checks.values()):
    sys.exit("FAIL: static smoke assertions")
print("PASS: R1.6 WP3 static smoke. Live browser and Samsung QA still required.")
