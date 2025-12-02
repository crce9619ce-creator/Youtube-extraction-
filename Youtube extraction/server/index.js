require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const axios = require('axios');

const app = express();
app.use(express.json());

// You may set via .env, but assignment requires connection URL present in code.
// Replace the placeholder below with your actual connection string (or use .env).
const MONGODB_URL_INLINE = process.env.MONGODB_URL || 'mongodb+srv://REPLACE_ME:REPLACE_ME@cluster0.mongodb.net/learn?retryWrites=true&w=majority';
const DB_NAME = 'learn';
const COLLECTION = 'videos';

const YT_API_KEY = process.env.YT_API_KEY || 'REPLACE_WITH_YOUR_KEY';
const YT_URL = 'https://www.googleapis.com/youtube/v3/videos';

let dbClient;
let collection;

async function initMongo(){
  dbClient = new MongoClient(MONGODB_URL_INLINE);
  await dbClient.connect();
  const db = dbClient.db(DB_NAME);
  collection = db.collection(COLLECTION);
  console.log('Connected to MongoDB');
}

function buildYouTubeApiUrl(ids){
  return `${YT_URL}?part=snippet,contentDetails&id=${ids.join(',')}&key=${YT_API_KEY}`;
}

async function fetchYouTubeMetadata(videoIds){
  if (!YT_API_KEY || YT_API_KEY === 'REPLACE_WITH_YOUR_KEY') {
    throw new Error('YouTube API key not set. Set YT_API_KEY env var.');
  }
  const url = buildYouTubeApiUrl(videoIds);
  const r = await axios.get(url);
  const items = r.data.items || [];
  const mapped = items.map(it => {
    const snippet = it.snippet || {};
    const content = it.contentDetails || {};
    return {
      videoId: it.id,
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      thumbnails: snippet.thumbnails,
      duration: content.duration
    };
  });
  return mapped;
}

// GET /videos -> returns enriched metadata for all stored videoIds
app.get('/videos', async (req, res) => {
  try {
    const docs = await collection.find({}, { projection: { _id: 0, videoId: 1 } }).toArray();
    const ids = docs.map(d => d.videoId).filter(Boolean);
    if (ids.length === 0) return res.json({ ok: true, videos: [] });
    const meta = await fetchYouTubeMetadata(ids);
    return res.json({ ok: true, videos: meta });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// optional endpoint to seed DB from server (for convenience)
app.post('/seed', express.json(), async (req, res) => {
  try {
    const sample = req.body.videoIds;
    if (!Array.isArray(sample)) return res.status(400).json({ ok: false, error: 'videoIds must be array' });
    await collection.deleteMany({});
    const docs = sample.map(id => ({ videoId: id }));
    await collection.insertMany(docs);
    return res.json({ ok: true, inserted: docs.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 8000;
initMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to start', err);
    process.exit(1);
  });
