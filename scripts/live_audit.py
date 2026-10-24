#!/usr/bin/env python3
"""Live SEO audit for phototorap.com pages: status, TDK, canonical, OG, H1, JSON-LD, word count, links."""
import json
import re
import subprocess
import sys
from html.parser import HTMLParser

BASE = "https://phototorap.com"

PAGES = [
    "/",
    "/ai-rap-generator",
    "/ai-rap-battle-generator",
    "/birthday-rap-song",
    "/diss-track-generator",
    "/halloween-rap-song",
    "/hotel-lobby-ai",
    "/rap-duo-name-generator",
    "/guides",
    "/pricing",
    "/privacy",
    "/terms",
    "/refund",
    "/ethics",
]

def discover_from_sitemap():
    """从线上 sitemap 读取全部 URL —— 新增页面无需改脚本，避免审计清单过期。"""
    try:
        xml = subprocess.run(
            ["curl", "-s", "--max-time", "25", f"{BASE}/sitemap.xml"],
            capture_output=True, text=True, timeout=40,
        ).stdout
        urls = re.findall(r"<loc>([^<]+)</loc>", xml)
        paths = []
        for u in urls:
            p = u.replace(BASE, "").rstrip("/")
            paths.append(p or "/")
        return sorted(set(paths))
    except Exception as e:  # 网络失败时退回静态清单
        print(f"[warn] sitemap 读取失败（{e}），使用静态清单", file=sys.stderr)
        return None


FALLBACK_PAGES = PAGES + ["/guides"]

_sitemap_paths = discover_from_sitemap()
ALL_PAGES = _sitemap_paths if _sitemap_paths else FALLBACK_PAGES


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ""
        self.metas = {}
        self.canonical = None
        self.hreflangs = []
        self.h1s = []
        self.jsonld = []
        self._in_h1 = 0
        self._h1_buf = ""
        self._in_jsonld = False
        self._jsonld_buf = ""
        self.links = []
        self.imgs_without_alt = 0
        self.imgs_total = 0
        self._skip_depth = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            name = a.get("name") or a.get("property") or a.get("itemprop")
            if name:
                self.metas[name.lower()] = a.get("content", "")
        elif tag == "link":
            if a.get("rel") == "canonical" and a.get("href"):
                self.canonical = a["href"]
            if a.get("hreflang"):
                self.hreflangs.append((a.get("hreflang"), a.get("href")))
        elif tag == "h1":
            self._in_h1 += 1
            self._h1_buf = ""
        elif tag == "script":
            if a.get("type") == "application/ld+json":
                self._in_jsonld = True
                self._jsonld_buf = ""
        elif tag == "a" and a.get("href"):
            self.links.append(a["href"])
        elif tag == "img":
            self.imgs_total += 1
            # alt="" 是装饰性图片的正确写法，不算缺失（这里只统计完全没有 alt 属性）
            if "alt" not in a:
                self.imgs_without_alt += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "h1" and self._in_h1:
            self._in_h1 -= 1
            self.h1s.append(self._h1_buf.strip())
        elif tag == "script" and self._in_jsonld:
            self._in_jsonld = False
            self.jsonld.append(self._jsonld_buf)

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self._in_h1:
            self._h1_buf += data
        if self._in_jsonld:
            self._jsonld_buf += data


def fetch(url):
    r = subprocess.run(
        ["curl", "-s", "-L", "--max-time", "30", "-w", "\n@@@STATUS@@@%{http_code} %{url_effective}",
         "-A", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
         url],
        capture_output=True, text=True,
    )
    parts = r.stdout.split("\n@@@STATUS@@@")
    if len(parts) == 2:
        body, status_final = parts
        status, final = status_final.split(" ", 1)
    else:
        body, status, final = r.stdout, "000", url
    return int(status), final, body


def audit(path):
    url = BASE + path
    status, final, body = fetch(url)
    row = {"path": path, "status": status, "final_url": final, "bytes": len(body)}
    if status != 200 or not body:
        row["error"] = "non-200 or empty"
        return row

    p = Parser()
    try:
        p.feed(body)
    except Exception:
        pass

    text = re.sub(r"<script.*?</script>", " ", body, flags=re.S)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    words = len(re.findall(r"[A-Za-z']+", text))

    row.update({
        "title": p.title.strip(),
        "title_len": len(p.title.strip()),
        "desc": (p.metas.get("description") or "")[:400],
        "desc_len": len(p.metas.get("description") or ""),
        "canonical": p.canonical,
        "og_title": p.metas.get("og:title"),
        "og_image": p.metas.get("og:image"),
        "og_type": p.metas.get("og:type"),
        "twitter_card": p.metas.get("twitter:card"),
        "robots_meta": p.metas.get("robots"),
        "h1s": p.h1s,
        "h1_count": len(p.h1s),
        "jsonld_types": [extract_type(b) for b in p.jsonld],
        "jsonld_count": len(p.jsonld),
        "words_approx": words,
        "internal_links": len([l for l in p.links if l.startswith("/") or "phototorap.com" in l]),
        "external_links": len([l for l in p.links if l.startswith("http") and "phototorap.com" not in l]),
        "imgs_total": p.imgs_total,
        "imgs_without_alt": p.imgs_without_alt,
        "hreflangs": p.hreflangs,
    })
    return row


def extract_type(block):
    try:
        data = json.loads(block)
        items = data if isinstance(data, list) else [data]
        types = []
        for it in items:
            t = it.get("@type")
            if isinstance(t, list):
                types.extend(t)
            elif t:
                types.append(t)
        return types
    except Exception:
        return ["<unparsable>"]


def main():
    rows = [audit(p) for p in ALL_PAGES]
    out = "/Users/crazy/X/SEOAGENT/phototorap-web/scripts/live_audit_result.json"
    with open(out, "w") as f:
        json.dump(rows, f, indent=2, ensure_ascii=False)

    # console summary
    print(f"{'page':<42} {'st':>4} {'title':>5} {'desc':>5} {'h1':>3} {'words':>6} {'ogimg':>6} jsonld")
    for r in rows:
        ogimg = "yes" if r.get("og_image") else "NO"
        print(f"{r['path']:<42} {r['status']:>4} {r.get('title_len','-'):>5} "
              f"{r.get('desc_len','-'):>5} {r.get('h1_count','-'):>3} {r.get('words_approx','-'):>6} {ogimg:>6} "
              f"{','.join(sum(r.get('jsonld_types', []), [])) if r.get('jsonld_types') else '-'}")
    print(f"\n[saved] {out}")


if __name__ == "__main__":
    main()
