const axios = require('axios');

async function register() {
  try {
    const res = await axios.post('http://localhost:8080/api/users/register', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Password123',
      phone: '0123456789'
    });
    console.log('Response status:', res.status);
    console.log('Response data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
  }
}

register();
