# Server (Node.js + Express)

## Setup
1. `cd server`
2. `npm install`
3. Edit `index.js` and replace `MONGODB_URL_INLINE` with your MongoDB connection string or set `MONGODB_URL` in environment.
4. Set `YT_API_KEY` as environment variable or in a `.env` file (see .env.example).

## Seed
- Option A (script): `node seed.js`
- Option B (server endpoint): POST /seed with JSON body `{ "videoIds": ["id1","id2",...] }`

## Run
`npm start` (server runs on port 8000 by default)
