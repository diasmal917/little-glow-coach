const crypto = require('crypto');

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  return Buffer.concat(chunks).toString('utf8');
};

const verifySlackRequest = (req, rawBody) => {
  const secret = process.env.SLACK_SIGNING_SECRET;
  if (!secret) return { ok: false, error: 'slack_signing_secret_missing' };

  const timestamp = req.headers['x-slack-request-timestamp'];
  const signature = req.headers['x-slack-signature'];
  if (!timestamp || !signature) return { ok: false, error: 'slack_signature_missing' };

  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 60 * 5) {
    return { ok: false, error: 'slack_signature_expired' };
  }

  const base = `v0:${timestamp}:${rawBody}`;
  const expected = `v0=${crypto.createHmac('sha256', secret).update(base).digest('hex')}`;
  const provided = Buffer.from(signature);
  const calculated = Buffer.from(expected);

  if (provided.length !== calculated.length || !crypto.timingSafeEqual(provided, calculated)) {
    return { ok: false, error: 'slack_signature_invalid' };
  }

  return { ok: true };
};

module.exports = {
  json,
  readRawBody,
  verifySlackRequest
};
