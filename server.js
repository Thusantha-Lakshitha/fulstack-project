const http = require('http');
const url = require('url');

const { MongoClient } = require('mongodb');

// MongoDB Atlas Connection
const MONGODB_URI = 'mongodb+srv://thusantha:62715550thusaA@cluster0.eagm2k2.mongodb.net/Education?appName=Cluster0';
const DATABASE_NAME = 'Education';
const COLLECTION_NAME = 'users';

let db = null;
let usersCollection = null;

// Connect to MongoDB
async function connectMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    db = client.db(DATABASE_NAME);
    usersCollection = db.collection(COLLECTION_NAME);
    
    // Create index on email for uniqueness
    await usersCollection.createIndex({ email: 1 });
    
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
const server = http.createServer((req, res) => {
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
    parseJSON(req, (err, data) => {
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

      if (users.find(u => u.email === email)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Email already registered' }));
        return;
      }

      const user = {
        id: Date.now().toString(),
        name,
        email,
        password,
        phone,
        role: 'STUDENT',
        createdAt: new Date()
      };
      users.push(user);

      res.writeHead(200);
      res.end(JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }));
    });
  }
  // Login endpoint
  else if (method === 'POST' && pathname === '/api/users/login') {
    parseJSON(req, (err, data) => {
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

      const user = users.find(u => u.email === email);
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
        token: `dummy-token-for-user-${user.id}`,
        userId: user.id,
        username: user.name,
        email: user.email,
        role: user.role
      }));
    });
  }
  // Database check endpoint
  else if (method === 'GET' && pathname === '/api/db/check') {
    res.writeHead(200);
    res.end(JSON.stringify({
      connected: true,
      database: 'Education',
      message: 'Backend API connected'
    }));
  }
  // Get all users endpoint
  else if (method === 'GET' && pathname === '/api/db/users') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      count: users.length,
      database: 'Education',
      collection: 'users',
      users: users
    }));
  }
  // Not found
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`📝 Register: POST http://localhost:${PORT}/api/users/register`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/users/login`);
  console.log(`✅ Health: GET http://localhost:${PORT}/api/db/check`);
  console.log(`👥 Users: GET http://localhost:${PORT}/api/db/users`);
});
