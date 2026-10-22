# Five Year Run

A life simulator for people who don't know what they want yet: choosing a first job, a gap year or a master's.

Answer four questions and it runs 1,000 versions of your next five years across 20 first moves and 11 cities, using the same events, odds and money math as the game. Then it shows what it found: your happiest and richest starts, burnout risks, and what your best lives had in common. Then you play the promising lives yourself.

## Files

- `artifact.html` is the source. It is also published as a claude.ai Artifact, where Claude can write fresh events, a read of your results, and a story of your five years.
- `index.html` is the standalone site page, built from the source with `python3 build.py`. On the website the Claude features are hidden and the game uses its built-in events.

Plain HTML, CSS and JavaScript with no dependencies. Saved lives stay in your browser's local storage.

## Deploy

Pushes to `main` deploy to Vercel automatically. After editing `artifact.html`, run `python3 build.py` and commit both files.
