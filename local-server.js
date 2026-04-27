const http = require('http');
const submitHandler = require('./api/submit');
const slackEventsHandler = require('./api/slack/events');

const server = http.createServer((req, res) => {
  if (req.url && req.url.startsWith('/api/submit')) return submitHandler(req, res);
  if (req.url && req.url.startsWith('/api/slack/events')) return slackEventsHandler(req, res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true, service: 'nannie-coach-api' }));
});

const port = process.env.PORT || 8787;
server.listen(port, () => console.log(`Nannie Coach API listening on ${port}`));
