# Five Year Run

A life simulator for people who don't know what they want yet: choosing a first job, a gap year or a master's.

Answer four questions and it runs 1,000 versions of your next five years across 20 first moves and 11 cities, using the same events, odds and money math as the game. Then it shows what it found: your happiest and richest starts, burnout risks, and what your best lives had in common. Then you play the promising lives yourself.

## AI features (any model)

The game and the simulations need no AI. With AI on, a language model writes fresh in-game events, reads your 1,000 results and suggests what to try first, and writes the story of your five years. Nothing is tied to one AI company. Players pick a provider in **AI settings**:

- **My own API key.** Any OpenAI-compatible chat API, called straight from the browser: OpenAI, OpenRouter (hundreds of models), Google Gemini, Anthropic, Groq, Mistral, DeepSeek, or a local model through Ollama or LM Studio. The key is stored only in that browser.
- **This site's AI.** Optional. If the site owner sets the environment variables below on Vercel, `api/ai.js` forwards prompts to their chosen model, so visitors need no key.
- **Claude on claude.ai.** Used only when the page runs as a claude.ai Artifact, where the page can't call other services.

### Server-side AI (optional)

Set these in the Vercel project settings, then redeploy:

| Variable | What it does |
| --- | --- |
| `AI_BASE_URL` | API address. Default `https://api.openai.com/v1`. Examples: `https://openrouter.ai/api/v1`, `https://api.groq.com/openai/v1`, `https://generativelanguage.googleapis.com/v1beta/openai` |
| `AI_API_KEY` | That service's API key |
| `AI_MODEL` | Model for stories and the results read. The proxy stays off until this is set |
| `AI_MODEL_QUICK` | Optional faster model for in-game events |
| `AI_LABEL` | Optional name shown to players |
| `AI_MAX_TOKENS` | Optional reply cap (default 900, max 1500) |

Every request is billed to that key. The proxy accepts only same-site requests carrying the game's own prompts, with size caps, but it has no real rate limiting, so set a spending limit with your provider.

## Files

- `artifact.html` is the source. The same file is also published as a claude.ai Artifact.
- `index.html` is the standalone site page, built from the source with `python3 build.py`.
- `api/ai.js` is the optional server-side AI proxy.

Plain HTML, CSS and JavaScript with no dependencies. Saved lives stay in your browser's local storage.

## Deploy

Pushes to `main` deploy to Vercel automatically. After editing `artifact.html`, run `python3 build.py` and commit both files.
