# WhatsApp Order Intake MVP (Next.js + Twilio Sandbox + OpenAI + Supabase)

Minimal production-like MVP that:
1. Receives WhatsApp messages via Twilio webhook (`/api/whatsapp`)
2. Uses an LLM to extract structured order data
3. Stores order rows in Supabase Postgres
4. Serves a minimal web UI (`/orders`, `/orders/[id]`) on Vercel

## Repo structure

```txt
app/
  api/whatsapp/route.ts      # Twilio webhook
  orders/page.tsx            # orders list UI
  orders/[id]/page.tsx       # order detail UI
  layout.tsx
  page.tsx
  globals.css
lib/
  extract-order.ts           # OpenAI JSON schema extraction
  orders.ts                  # DB reads for UI
  privacy.ts                 # sender hashing + short order ID
  supabase.ts                # server-side Supabase client
  twilio.ts                  # signature validation + TwiML
  types.ts
db/
  schema.sql                 # database schema
.env.example
```

## 1) Create the database (Supabase free tier)

1. Go to https://supabase.com and create a new project (free).
2. In SQL Editor, paste and run `db/schema.sql`.
3. In **Project Settings → API** copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## 2) Twilio WhatsApp sandbox

1. Create a free Twilio account.
2. Open **Messaging → Try it out → Send a WhatsApp message**.
3. Join sandbox from your phone by sending the join code shown by Twilio.
4. Copy your Twilio **Auth Token** for `TWILIO_AUTH_TOKEN`.

## 3) OpenAI

1. Create API key in OpenAI dashboard.
2. Set `OPENAI_API_KEY`.
3. Keep `OPENAI_MODEL=gpt-4o-mini` for cheapest demo.

## 4) Local run

```bash
npm install
cp .env.example .env
# Fill all env vars in .env
npm run dev
```

Open `http://localhost:3000/orders`.

## 5) Deploy to Vercel (backend fully operational)

### Option A: Vercel Git import
1. Push this repo to GitHub.
2. In Vercel: **Add New Project** → import repo.
3. Add all env vars from `.env.example` in Vercel project settings.
4. Deploy.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

Then add env vars in Vercel dashboard and redeploy.

## 6) Configure Twilio webhook

In Twilio Sandbox settings:
- **When a message comes in**: `https://YOUR_VERCEL_DOMAIN/api/whatsapp`
- Method: `POST`

Set `PUBLIC_WEBHOOK_BASE_URL=https://YOUR_VERCEL_DOMAIN` in Vercel env.

## Environment variables

See `.env.example`:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `TWILIO_AUTH_TOKEN`
- `PUBLIC_WEBHOOK_BASE_URL`
- `SENDER_HASH_SALT`

## Webhook behavior

`POST /api/whatsapp` (form-encoded from Twilio):
- Reads `From` and `Body`
- Verifies `X-Twilio-Signature`
- Parses message via OpenAI with strict JSON schema
- Hashes sender phone with SHA-256 + salt
- Inserts into `orders`
- Replies with TwiML: `Got it. Your order was received. Order #XYZ.`

## Demo script

1. Send this WhatsApp message to Twilio sandbox number:

```txt
I want 2 large pepperoni pizzas and 1 coke. Delivery to 12 Main St. Pay cash.
```

2. Expected WhatsApp reply:

```txt
Got it. Your order was received. Order #<SHORT_ID>.
```

3. Open:
- `https://YOUR_VERCEL_DOMAIN/orders` (list)
- Click row → `https://YOUR_VERCEL_DOMAIN/orders/<id>` (detail)

## Security in this MVP

- Twilio webhook signature validation (`X-Twilio-Signature`) using `TWILIO_AUTH_TOKEN`.
- Sender phone is not stored raw; only salted SHA-256 hash in `sender`.
- Secrets are server-side environment variables only.
