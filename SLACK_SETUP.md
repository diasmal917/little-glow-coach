# Nannie Coach Slack Setup

## What is implemented

- `POST /api/submit` sends homework from the portal into Slack.
- `POST /api/slack/events` receives Slack message events and replies as Chib.
- Replies use OpenAI when `OPENAI_API_KEY` and `OPENAI_MODEL` are set. Without them, Chib sends a simple fallback coaching reply.

## Deploy target

GitHub Pages can host the portal, but it cannot run the API routes. Deploy this repo to Vercel or another Node serverless host for the API.

Set these environment variables on the API host:

- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`
- `DIAS_SLACK_USER_ID`
- `NANNIE_SLACK_USER_ID`
- `NANNIE_LEARNING_CHANNEL_ID` optional
- `OPENAI_API_KEY` optional but recommended
- `OPENAI_MODEL`
- `ALLOWED_ORIGIN`, for example `https://diasmal917.github.io`

Then update `public/public-config.js`:

```js
window.NANNIE_API_ENDPOINT = 'https://your-vercel-app.vercel.app/api/submit'
```

## Slack app settings

Use this request URL:

```text
https://your-vercel-app.vercel.app/api/slack/events
```

Bot token scopes:

- `chat:write`
- `im:history` for direct messages
- `app_mentions:read` if she will mention the bot in channels
- `channels:history` if used in public channels

Event subscriptions:

- `message.im`
- `app_mention`
- `message.channels` optional, only if she will use a public channel

After changing scopes or events, reinstall the Slack app to the workspace.
