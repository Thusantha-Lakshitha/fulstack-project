const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

function readProperties() {
  const propsPath = path.join(__dirname, 'Backend', 'src', 'main', 'resources', 'application.properties');
  if (!fs.existsSync(propsPath)) throw new Error(`Properties file not found: ${propsPath}`);
  const content = fs.readFileSync(propsPath, 'utf8');
  const get = (key, defaultVal) => {
    const re = new RegExp('^\\s*' + key.replace(/\./g, '\\.') + '\\s*=\\s*(.+)$', 'm');
    const m = content.match(re);
    if (!m) return defaultVal;
    let val = m[1].trim();
    const envDefaultMatch = val.match(/\$\{[^:}]+:([^}]+)\}/);
    if (envDefaultMatch) val = envDefaultMatch[1];
    return val.replace(/^"|"$/g, '');
  };
  return {
    uri: get('spring.data.mongodb.uri'),
    adminEmail: get('app.admin.seed.email', 'admin@lms.com'),
    adminPassword: get('app.admin.seed.password', 'Admin@12345')
  };
}

async function upsertAdmin() {
  const { uri, adminEmail, adminPassword } = readProperties();
  if (!uri) throw new Error('MongoDB URI not found in properties');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('Education');
    const users = db.collection('users');

    const existing = await users.findOne({ email: adminEmail });
    if (existing) {
      await users.updateOne({ email: adminEmail }, { $set: { role: 'ADMIN', password: adminPassword, name: existing.name || 'System Admin' } });
      console.log(`Updated existing admin user: ${adminEmail}`);
    } else {
      const doc = {
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        createdAt: new Date()
      };
      const res = await users.insertOne(doc);
      console.log(`Inserted admin user (${res.insertedId}): ${adminEmail}`);
    }
  } catch (err) {
    console.error('Error upserting admin:', err.message);
  } finally {
    await client.close();
  }
}

upsertAdmin();
