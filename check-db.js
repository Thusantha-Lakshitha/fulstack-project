const fs = require('fs');
const path = require('path');
const { MongoClient } = require("mongodb");

function readAtlasUriFromProperties() {
  const propsPath = path.join(__dirname, 'Backend', 'src', 'main', 'resources', 'application.properties');
  if (!fs.existsSync(propsPath)) return null;
  const content = fs.readFileSync(propsPath, 'utf8');
  const m = content.match(/^\s*spring\.data\.mongodb\.uri\s*=\s*(.+)$/m);
  if (!m) return null;
  let uri = m[1].trim();
  const envDefaultMatch = uri.match(/\$\{[^:}]+:([^}]+)\}/);
  if (envDefaultMatch) uri = envDefaultMatch[1];
  uri = uri.replace(/^"|"$/g, '');
  return uri;
}

const uri = readAtlasUriFromProperties() || process.env.MONGODB_URI;
async function testConnection() {
  if (!uri) {
    console.error('No MongoDB URI found in application.properties or MONGODB_URI env var');
    return;
  }
  const client = new MongoClient(uri);

  try {
    console.log("🔄 Attempting to connect to MongoDB Atlas...");
    await client.connect();
    
    console.log("✅ Connection successful!");

    // Get database info
    const db = client.db("Education");
    const collections = await db.listCollections().toArray();
    console.log("\n📦 Collections in Education database:");
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Check users collection
    const usersCollection = db.collection("users");
    const userCount = await usersCollection.countDocuments();
    console.log(`\n👥 Total users registered: ${userCount}`);

    if (userCount > 0) {
      console.log("\n📋 User records:");
      const users = await usersCollection.find().toArray();
      users.forEach((user, idx) => {
        console.log(`\n  [${idx + 1}] Name: ${user.name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Role: ${user.role || 'N/A'}`);
      });
    }

  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

testConnection();
