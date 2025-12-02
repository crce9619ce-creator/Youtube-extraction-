const { MongoClient } = require('mongodb');

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://REPLACE_ME:REPLACE_ME@cluster0.mongodb.net/learn?retryWrites=true&w=majority';
const DB_NAME = 'learn';
const COLLECTION = 'videos';

const sampleIds = [
  'Ks-_Mh1QhMc',
  'dQw4w9WgXcQ',
  '3JZ_D3ELwOQ',
  'e-ORhEE9VVg',
  'fJ9rUzIMcZQ',
  'kJQP7kiw5Fk',
  'RgKAFK5djSk',
  'JGwWNGJdvx8',
  '60ItHLz5WEA',
  '2Vv-BfVoq4g'
];

(async () => {
  const client = new MongoClient(MONGODB_URL);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);
    await col.deleteMany({});
    const docs = sampleIds.map(id => ({ videoId: id }));
    const r = await col.insertMany(docs);
    console.log('Inserted', Object.keys(r.insertedIds).length);
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    await client.close();
  }
})();
