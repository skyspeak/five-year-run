"""Build the standalone site page (index.html) from artifact.html.

artifact.html is the claude.ai Artifact source, which has no doctype or <html>
wrapper because claude.ai adds its own. The website needs a complete document.
"""
from pathlib import Path

root = Path(__file__).parent
body = (root / "artifact.html").read_text()
head = """<!doctype html>
<html lang="en">
<meta name="description" content="Don't know what you want? Five Year Run simulates 1,000 versions of your next five years across first jobs, gap years, master's degrees and cities, shows what it found, then lets you play the most promising lives yourself.">
<meta property="og:title" content="Five Year Run">
<meta property="og:description" content="We ran 1,000 versions of your next five years. Here's what we found.">
<meta name="theme-color" content="#121A2B">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23E2492F'/%3E%3Ctext x='16' y='21' font-family='Arial,sans-serif' font-weight='800' font-size='13' text-anchor='middle' fill='white'%3E5Y%3C/text%3E%3C/svg%3E">
"""
(root / "index.html").write_text(head + body + "\n</html>\n")
print("wrote index.html")
