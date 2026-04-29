"""
Extract bounding boxes from SVG node groups and output JSON.

Usage:
    cd scripts && uv run extract-bounds.py [path-to-svg]

If no path is given, fetches the diagram SVG from CDN.
Parses all <g id="node__*"> elements, computes their union bounding box
from child <rect> elements, and writes the result to
src/lib/constants/diagram-bounds.generated.json.
"""

import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import requests

SVG_URL = "https://projects.twreporter.org/twreporter/ddd/2026-03-baseball/assets/diagram.svg?030615"
OUTPUT = (
    Path(__file__).resolve().parent.parent
    / "src/lib/constants/diagram-bounds.generated.json"
)
NS = "http://www.w3.org/2000/svg"


def fetch_svg(path: str | None) -> str:
    if path:
        return Path(path).read_text()
    return requests.get(SVG_URL).text


def collect_rects(el: ET.Element) -> list[tuple[float, float, float, float]]:
    rects = []
    tag = el.tag.split("}")[-1] if "}" in el.tag else el.tag
    if tag == "rect":
        x = float(el.get("x", 0))
        y = float(el.get("y", 0))
        w = float(el.get("width", 0))
        h = float(el.get("height", 0))
        transform = el.get("transform", "")
        m = re.search(r"translate\(([^,)]+)[,\s]+([^)]+)\)", transform)
        if m:
            x += float(m.group(1))
            y += float(m.group(2))
        rects.append((x, y, w, h))
    for child in el:
        rects.extend(collect_rects(child))
    return rects


def r(n: float) -> float:
    return round(n, 2)


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else None
    source = f"local {path}" if path else SVG_URL
    print(f"Loading {source}...")
    text = fetch_svg(path)
    root = ET.fromstring(text)

    svg_w = float(root.get("width", 0))
    svg_h = float(root.get("height", 0))
    vb = root.get("viewBox", "").split()
    if len(vb) == 4:
        svg_w = float(vb[2])
        svg_h = float(vb[3])

    bounds = {}
    for g in root.iter(f"{{{NS}}}g"):
        gid = g.get("id", "")
        if not gid.startswith("node__"):
            continue
        rects = collect_rects(g)
        if not rects:
            continue

        min_x = min(x for x, _, _, _ in rects)
        min_y = min(y for _, y, _, _ in rects)
        max_x = max(x + w for x, _, w, _ in rects)
        max_y = max(y + h for _, y, _, h in rects)
        bw = max_x - min_x
        bh = max_y - min_y

        bounds[gid] = {
            "x": r(min_x),
            "y": r(min_y),
            "width": r(bw),
            "height": r(bh),
            "cx": r(min_x + bw / 2),
            "cy": r(min_y + bh / 2),
        }

    data = {
        "width": int(svg_w),
        "height": int(svg_h),
        "bounds": dict(sorted(bounds.items())),
    }

    OUTPUT.write_text(json.dumps(data, indent=2) + "\n")
    print(f"Wrote {len(bounds)} nodes to {OUTPUT}")


if __name__ == "__main__":
    main()
