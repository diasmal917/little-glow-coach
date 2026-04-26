const { WebClient } = require('@slack/web-api');

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, bypass-tunnel-reminder');
  res.end(JSON.stringify(body));
};

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method_not_allowed' });

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks.map(c => Buffer.isBuffer(c) ? c : Buffer.from(String(c)))).toString('utf8') || '{}');

    const name = String(body.name || 'Nannie').slice(0, 80);
    const lessonTitle = String(body.lessonTitle || '').slice(0, 160);
    const lessonArea = String(body.lessonArea || '').slice(0, 80);
    const answer = String(body.answer || '').slice(0, 2500);
    const xp = Number(body.xp || 0);

    if (!lessonTitle || !answer || answer.trim().length < 3) {
      return json(res, 400, { ok: false, error: 'missing_lesson_or_answer' });
    }

    const token = process.env.SLACK_BOT_TOKEN;
    const diasUserId = process.env.DIAS_SLACK_USER_ID;
    const nannieUserId = process.env.NANNIE_SLACK_USER_ID;
    const channelId = process.env.NANNIE_LEARNING_CHANNEL_ID;

    if (!token || !diasUserId) {
      return json(res, 500, { ok: false, error: 'slack_not_configured' });
    }

    const client = new WebClient(token);
    const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

    const mentorText = `🎀 *Nannie homework submitted*\n*Lesson:* ${lessonTitle}\n*Area:* ${lessonArea}\n*XP:* ${xp}\n*Time:* ${now}\n\n*Answer:*\n${answer}\n\nChib action: grade this, congratulate if acceptable, assign next quest. If weak, give gentle Thai correction.`;

    const accountabilityText = `📚 *Nannie submitted homework*\n*Lesson:* ${lessonTitle}\n*Area:* ${lessonArea}\n*XP:* ${xp}\n\nI’ll review it and keep her moving.`;

    await client.chat.postMessage({ channel: diasUserId, text: accountabilityText });
    if (channelId) await client.chat.postMessage({ channel: channelId, text: mentorText });
    if (nannieUserId) {
      await client.chat.postMessage({
        channel: nannieUserId,
        text: `เก่งมาก ${name} 💖 ส่งการบ้านแล้วนะคะ\nบทเรียน: *${lessonTitle}*\nChib จะตรวจและบอกขั้นตอนต่อไปให้ค่ะ ✨`
      });
    }

    return json(res, 200, { ok: true });
  } catch (err) {
    return json(res, 500, { ok: false, error: 'server_error', detail: String(err && err.message || err).slice(0, 200) });
  }
};
