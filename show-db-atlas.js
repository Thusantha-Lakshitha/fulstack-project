const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

function readAtlasUriFromProperties() {
  const propsPath = path.join(__dirname, 'Backend', 'src', 'main', 'resources', 'application.properties');
  if (!fs.existsSync(propsPath)) throw new Error(`Properties file not found: ${propsPath}`);
  const content = fs.readFileSync(propsPath, 'utf8');

  // Match spring.data.mongodb.uri=... and extract either the direct value or the default inside ${...:value}
  const m = content.match(/^\s*spring\.data\.mongodb\.uri\s*=\s*(.+)$/m);
  if (!m) throw new Error('spring.data.mongodb.uri not found in application.properties');
  let uri = m[1].trim();

  // If value uses ${MONGODB_URI:mongodb+srv://...} take the default after the colon
  const envDefaultMatch = uri.match(/\$\{[^:}]+:([^}]+)\}/);
  if (envDefaultMatch) uri = envDefaultMatch[1];

  // Strip surrounding quotes if any
  uri = uri.replace(/^"|"$/g, '');
  return uri;
}

async function showAtlasEducation() {
  const uri = readAtlasUriFromProperties();
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const dbName = 'Education';
    const db = client.db(dbName);

    const collections = await db.listCollections().toArray();
    console.log(`\nCollections in ${dbName}:`);
    collections.forEach(c => console.log(' -', c.name));

    if (collections.some(c => c.name === 'users')) {
      const users = await db.collection('users').find().toArray();
      console.log(`\nUsers in ${dbName}.users (count=${users.length}):`);
      users.forEach((u, i) => {
        console.log(`\n[${i+1}] id: ${u._id}`);
        console.log('    name:', u.name);
        console.log('    email:', u.email);
        console.log('    role:', u.role);
      });
    } else {
      console.log(`\nNo 'users' collection found in ${dbName}`);
    }

  } catch (err) {
    console.error('Error connecting to Atlas:', err.message);
  } finally {
    await client.close();
  }
}

showAtlasEducation();
