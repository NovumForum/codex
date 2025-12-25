import type { VercelRequest, VercelResponse } from '@vercel/node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-webhook-secret'
};

function withCors(res: VercelResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
}

function parseBody(req: VercelRequest) {
  if (!req.body) return {};

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      console.error('deploy: failed to parse JSON body', error);
      return {};
    }
  }

  return req.body;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  withCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK;
  if (!hookUrl) {
    return res.status(503).json({ ok: false, error: 'Missing configuration: VERCEL_DEPLOY_HOOK' });
  }

  const configuredSecret = process.env.WEBHOOK_SECRET;
  const headerSecret = req.headers['x-webhook-secret'];
  const requestSecret = Array.isArray(headerSecret) ? headerSecret[0] : headerSecret;

  if (!configuredSecret) {
    return res.status(503).json({ ok: false, error: 'Missing configuration: WEBHOOK_SECRET' });
  }

  if (configuredSecret !== requestSecret) {
    return res.status(401).json({ ok: false, error: 'Invalid webhook secret' });
  }

  const body = parseBody(req);

  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    if (!response.ok) {
      console.error('deploy: failed to trigger deploy', { status: response.status, text });
      return res.status(502).json({ ok: false, error: 'Failed to trigger deploy' });
    }

    return res.status(200).json({ ok: true, status: response.status, body: text || 'Deploy triggered' });
  } catch (error) {
    console.error('deploy: unexpected error', error);
    return res.status(502).json({ ok: false, error: 'Failed to trigger deploy' });
  }
}
