const { MongoClient } = require('mongodb');

// URI taken from Backend/src/main/resources/application.properties
const uri = 'mongodb+srv://EduLMS:syxR590vmo1BywPU@cluster0.eagm2k2.mongodb.net/?appName=Cluster0';

async function test() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    console.log('Attempting to connect to Atlas...');
    await client.connect();
    const admin = client.db('admin');
    const ping = await admin.command({ ping: 1 });
    console.log('Ping:', ping);
    const db = client.db('Education');
    const cols = await db.listCollections().toArray();
    console.log('Collections in Education:', cols.map(c => c.name));
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await client.close();
  }
}

test();
