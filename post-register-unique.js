const axios = require('axios');

async function register() {
  try {
    const ts = Date.now();
    const res = await axios.post('http://localhost:8080/api/users/register', {
      name: `Auto User ${ts}`,
      email: `autouser+${ts}@example.com`,
      password: 'Password123',
      phone: '0000000000'
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
