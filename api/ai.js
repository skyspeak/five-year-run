// Optional AI proxy for the website: forwards the game's prompts to any
// OpenAI-compatible chat API using the site owner's key, so visitors don't need one.
// Off unless AI_MODEL is set (plus AI_API_KEY for hosted services).
//
//   AI_BASE_URL     API address, default https://api.openai.com/v1
//                   e.g. https://openrouter.ai/api/v1, https://api.groq.com/openai/v1,
//                   https://generativelanguage.googleapis.com/v1beta/openai
//   AI_API_KEY      the service's API key
//   AI_MODEL        model for stories and the results read
//   AI_MODEL_QUICK  optional faster model for in-game events (defaults to AI_MODEL)
//   AI_LABEL        optional name shown to players (defaults to AI_MODEL)
//   AI_MAX_TOKENS   optional reply cap, default 900, at most 1500
//
// Every request costs the site owner money. The checks below stop casual reuse
// (same-site origin, game prompts only, size caps) but are not real rate limiting.

export const config = { runtime: 'edge' };

const MAX_PROMPT_CHARS = 24000;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export default async function handler(req) {
  const env = process.env;
  const base = (env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const model = env.AI_MODEL;
  const enabled = Boolean(model && (env.AI_API_KEY || env.AI_BASE_URL));

  if (req.method === 'GET') return json({ enabled, label: enabled ? env.AI_LABEL || model : null });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  if (!enabled) return json({ error: 'not_configured' }, 503);

  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== req.headers.get('host')) return json({ error: 'forbidden' }, 403);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_json' }, 400);
  }
  const prompt = typeof body?.prompt === 'string' ? body.prompt : '';
  if (!prompt || prompt.length > MAX_PROMPT_CHARS || !prompt.includes('"Five Year Run"')) {
    return json({ error: 'bad_prompt' }, 400);
  }

  const cap = Math.min(Number(env.AI_MAX_TOKENS) || 900, 1500);
  const upstream = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(env.AI_API_KEY ? { authorization: `Bearer ${env.AI_API_KEY}` } : {}),
    },
    body: JSON.stringify({
      model: body.quick ? env.AI_MODEL_QUICK || model : model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: Math.min(Number(body.maxTokens) || cap, cap),
    }),
  }).catch(() => null);

  if (!upstream) return json({ error: 'upstream_unreachable' }, 502);
  if (!upstream.ok) {
    const status = upstream.status === 429 ? 429 : 502;
    return json({ error: 'upstream', status: upstream.status }, status);
  }
  return new Response(upstream.body, {
    headers: {
      'content-type': upstream.headers.get('content-type') || 'text/event-stream',
      'cache-control': 'no-store',
    },
  });
}
