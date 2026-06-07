const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://Education:T2BOU0VvzyHclfjT@cluster0.eagm2k2.mongodb.net/Education?retryWrites=true&w=majority";

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await client.connect();
    
    const admin = client.db("admin");
    const status = await admin.command({ ping: 1 });
    
    console.log("✓ Connection successful!");
    console.log("Ping response:", status);

    // Get database info
    const db = client.db("Education");
    const collections = await db.listCollections().toArray();
    console.log("\nCollections in Education database:");
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Check users collection
    const usersCollection = db.collection("users");
    const userCount = await usersCollection.countDocuments();
    console.log(`\nTotal users: ${userCount}`);

    if (userCount > 0) {
      console.log("\nSample users (first 3):");
      const samples = await usersCollection.find().limit(3).toArray();
      console.log(JSON.stringify(samples, null, 2));
    }

  } catch (err) {
    console.error("✗ Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

testConnection();
