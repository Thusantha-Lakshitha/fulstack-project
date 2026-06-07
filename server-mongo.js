const http = require('http');
const url = require('url');
const { MongoClient } = require('mongodb');

// MongoDB Atlas Configuration
const fs = require('fs');
const path = require('path');

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

const MONGODB_URI = readAtlasUriFromProperties() || process.env.MONGODB_URI || 'mongodb+srv://thusantha:62715550thusaA@cluster0.eagm2k2.mongodb.net/Education?appName=Cluster0';
const DATABASE_NAME = 'Education';
const COLLECTION_NAME = 'users';

let client = null;
let db = null;
let usersCollection = null;

// Connect to MongoDB
async function connectMongoDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    db = client.db(DATABASE_NAME);
    usersCollection = db.collection(COLLECTION_NAME);
    
    // Create index on email
    await usersCollection.createIndex({ email: 1 });
    console.log('✅ Database ready');
    
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    return false;
  }
}

// Parse JSON body
function parseJSON(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      callback(null, body ? JSON.parse(body) : {});
    } catch (err) {
      callback(err);
    }
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Register endpoint
  if (method === 'POST' && pathname === '/api/users/register') {
    parseJSON(req, async (err, data) => {
      if (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      const { name, email, password, phone } = data;

      if (!name || !email || !password || !phone) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'All fields required' }));
        return;
      }

      if (!usersCollection) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Database not connected' }));
        return;
      }

      try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Email already registered' }));
          return;
        }

        const user = {
          name,
          email,
          password,
          phone,
          role: 'STUDENT',
          createdAt: new Date()
        };
        const result = await usersCollection.insertOne(user);

        res.writeHead(200);
        res.end(JSON.stringify({
          id: result.insertedId.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }));
      } catch (err) {
        console.error('Register error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Registration failed' }));
      }
    });
  }
  // Login endpoint
  else if (method === 'POST' && pathname === '/api/users/login') {
    parseJSON(req, async (err, data) => {
      if (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      const { email, password } = data;

      if (!email || !password) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Email and password required' }));
        return;
      }

      if (!usersCollection) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Database not connected' }));
        return;
      }

      try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
          res.writeHead(401);
          res.end(JSON.stringify({ error: 'Invalid email or password' }));
          return;
        }

        if (user.password !== password) {
          res.writeHead(401);
          res.end(JSON.stringify({ error: 'Invalid email or password' }));
          return;
        }

        res.writeHead(200);
        res.end(JSON.stringify({
          message: 'Login successful',
          token: `dummy-token-for-user-${user._id}`,
          userId: user._id.toString(),
          username: user.name,
          email: user.email,
          role: user.role
        }));
      } catch (err) {
        console.error('Login error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Login failed' }));
      }
    });
  }
  // Database check endpoint
  else if (method === 'GET' && pathname === '/api/db/check') {
    if (usersCollection) {
      res.writeHead(200);
      res.end(JSON.stringify({
        connected: true,
        database: DATABASE_NAME,
        message: 'MongoDB Atlas connection successful'
      }));
    } else {
      res.writeHead(500);
      res.end(JSON.stringify({
        connected: false,
        database: DATABASE_NAME,
        message: 'Database not connected'
      }));
    }
  }
  // Get all users endpoint
  else if (method === 'GET' && pathname === '/api/db/users') {
    if (!usersCollection) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Database not connected' }));
      return;
    }

    try {
      const users = await usersCollection.find({}).toArray();
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        count: users.length,
        database: DATABASE_NAME,
        collection: COLLECTION_NAME,
        users: users
      }));
    } catch (err) {
      console.error('Get users error:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to fetch users' }));
    }
  }
  // Admin resource endpoints (list, create, update, delete)
  else if (pathname.startsWith('/api/admin/')) {
    const parts = pathname.split('/').filter(Boolean); // ['api','admin','resource', id?]
    const resource = parts[2];

    // List with pagination and search: GET /api/admin/:resource
    if (method === 'GET' && parts.length === 3) {
      try {
        const { query } = parsedUrl.query || {};
        const page = Number(parsedUrl.query.page) || 0;
        const size = Number(parsedUrl.query.size) || 10;

        const col = db.collection(resource);
        const filter = {};
        if (parsedUrl.query.query) {
          const q = parsedUrl.query.query;
          filter.$or = [ { name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } } ];
        }

        const totalElements = await col.countDocuments(filter);
        const raw = await col.find(filter).skip(page * size).limit(size).toArray();
        // Map MongoDB documents to include `id` (string) for frontend compatibility
        const content = raw.map((doc) => {
          const mapped = { ...doc };
          if (doc._id) mapped.id = String(doc._id);
          delete mapped._id;
          return mapped;
        });

        res.writeHead(200);
        res.end(JSON.stringify({ content, totalElements, totalPages: Math.ceil(totalElements / size), number: page }));
      } catch (err) {
        console.error('Admin list error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to list resource' }));
      }
      return;
    }

    // Create resource: POST /api/admin/:resource
    if (method === 'POST' && parts.length === 3) {
      parseJSON(req, async (err, data) => {
        if (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }
        try {
          const col = db.collection(resource);
          const now = new Date();
          const doc = { ...data, createdAt: now };
          const result = await col.insertOne(doc);
          const insertedId = String(result.insertedId);
          const returned = { id: insertedId, ...doc };
          res.writeHead(200);
          res.end(JSON.stringify(returned));
        } catch (err) {
          console.error('Admin create error:', err);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Failed to create resource' }));
        }
      });
      return;
    }

    // Update resource: PUT /api/admin/:resource/:id
    if (method === 'PUT' && parts.length === 4) {
      const id = parts[3];
      parseJSON(req, async (err, data) => {
        if (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }
        try {
          const col = db.collection(resource);
          const { ObjectId } = require('mongodb');
          const _id = ObjectId.isValid(id) ? new ObjectId(id) : id;
          await col.updateOne({ _id }, { $set: data });
          res.writeHead(200);
          res.end(JSON.stringify({ success: true }));
        } catch (err) {
          console.error('Admin update error:', err);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Failed to update resource' }));
        }
      });
      return;
    }

    // Delete resource: DELETE /api/admin/:resource/:id
    if (method === 'DELETE' && parts.length === 4) {
      const id = parts[3];
      try {
        const col = db.collection(resource);
        const { ObjectId } = require('mongodb');
        const _id = ObjectId.isValid(id) ? new ObjectId(id) : id;
        await col.deleteOne({ _id });
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('Admin delete error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to delete resource' }));
      }
      return;
    }
  }
  // Not found
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

// Start server and connect to MongoDB
async function start() {
  const connected = await connectMongoDB();
  
  if (!connected) {
    console.error('Failed to connect to MongoDB. Exiting...');
    process.exit(1);
  }

  const PORT = 8080;
  server.listen(PORT, () => {
    console.log(`\n🚀 Backend API running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${DATABASE_NAME}`);
    console.log(`📋 Collection: ${COLLECTION_NAME}`);
    console.log(`\n📝 Register: POST http://localhost:${PORT}/api/users/register`);
    console.log(`🔐 Login: POST http://localhost:${PORT}/api/users/login`);
    console.log(`✅ Health: GET http://localhost:${PORT}/api/db/check`);
    console.log(`👥 Users: GET http://localhost:${PORT}/api/db/users\n`);
  });
}

start();
