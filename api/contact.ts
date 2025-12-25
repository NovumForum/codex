import { Buffer } from 'node:buffer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

type MailProvider = 'mailgun' | 'sendgrid' | 'none';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function withCors(res: VercelResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
}

function parseBody(req: VercelRequest): ContactBody {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      console.error('contact: failed to parse JSON body', error);
      return {};
    }
  }

  return req.body as ContactBody;
}

function badRequest(res: VercelResponse, error: string) {
  withCors(res);
  return res.status(400).json({ ok: false, error });
}

function methodNotAllowed(res: VercelResponse) {
  withCors(res);
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

function missingConfig(res: VercelResponse, field: string) {
  withCors(res);
  return res.status(503).json({ ok: false, error: `Missing configuration: ${field}` });
}

function normalizedProvider(provider?: string): MailProvider {
  const value = (provider ?? 'none').toLowerCase();
  if (value === 'mailgun' || value === 'sendgrid') {
    return value;
  }
  return 'none';
}

function sanitizeInput(value?: string) {
  if (!value) return '';
  return value.toString().trim();
}

async function sendMailgunEmail(params: {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  apiKey: string;
  domain: string;
}) {
  const { from, to, subject, text, replyTo, apiKey, domain } = params;
  const url = `https://api.mailgun.net/v3/${domain}/messages`;
  const body = new URLSearchParams({
    from,
    to,
    subject,
    text
  });

  if (replyTo) {
    body.append('h:Reply-To', replyTo);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
    },
    body
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Mailgun error (${response.status}): ${details}`);
  }
}

async function sendSendgridEmail(params: {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  apiKey: string;
}) {
  const { from, to, subject, text, replyTo, apiKey } = params;
  const payload = {
    personalizations: [
      {
        to: [{ email: to }],
        subject
      }
    ],
    from: { email: from },
    content: [
      {
        type: 'text/plain',
        value: text
      }
    ],
    reply_to: replyTo ? { email: replyTo } : undefined
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`SendGrid error (${response.status}): ${details}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  withCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const { name, email, message } = parseBody(req);
  const safeName = sanitizeInput(name);
  const safeEmail = sanitizeInput(email);
  const safeMessage = sanitizeInput(message);

  if (!safeName || !safeEmail || !safeMessage) {
    return badRequest(res, 'Missing name, email, or message');
  }

  if (!safeEmail.includes('@')) {
    return badRequest(res, 'Invalid email');
  }

  const provider = normalizedProvider(process.env.MAIL_PROVIDER);
  if (provider === 'none') {
    return missingConfig(res, 'MAIL_PROVIDER');
  }

  const contactEmail = sanitizeInput(process.env.CONTACT_EMAIL);
  const fromEmail = sanitizeInput(process.env.MAIL_FROM || contactEmail);

  if (!contactEmail) {
    return missingConfig(res, 'CONTACT_EMAIL');
  }

  if (!fromEmail) {
    return missingConfig(res, 'MAIL_FROM');
  }

  const subject = `New contact form submission from ${safeName}`;
  const text = `Name: ${safeName}\nEmail: ${safeEmail}\n\n${safeMessage}`;

  try {
    if (provider === 'mailgun') {
      const apiKey = sanitizeInput(process.env.MAILGUN_API_KEY);
      const domain = sanitizeInput(process.env.MAILGUN_DOMAIN);

      if (!apiKey) {
        return missingConfig(res, 'MAILGUN_API_KEY');
      }

      if (!domain) {
        return missingConfig(res, 'MAILGUN_DOMAIN');
      }

      await sendMailgunEmail({
        from: fromEmail,
        to: contactEmail,
        subject,
        text,
        replyTo: safeEmail,
        apiKey,
        domain
      });
    } else if (provider === 'sendgrid') {
      const apiKey = sanitizeInput(process.env.SENDGRID_API_KEY);

      if (!apiKey) {
        return missingConfig(res, 'SENDGRID_API_KEY');
      }

      await sendSendgridEmail({
        from: fromEmail,
        to: contactEmail,
        subject,
        text,
        replyTo: safeEmail,
        apiKey
      });
    }

    return res.status(200).json({ ok: true, provider });
  } catch (error) {
    console.error('contact: failed to send email', error);
    return res.status(502).json({ ok: false, error: 'Failed to send message' });
  }
}
