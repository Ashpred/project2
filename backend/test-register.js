const fetch = require('node-fetch');

const testRegisterUser = async () => {
  try {
    console.log('Testing register endpoint...');
    
    const testUser = {
      fullName: 'Test User',
      username: 'testuser' + Math.floor(Math.random() * 10000),
      email: 'test' + Math.floor(Math.random() * 10000) + '@example.com',
      password: 'password123'
    };
    
    console.log('Test user data:', {
      ...testUser,
      password: '[HIDDEN]'
    });
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('Parsed response:', data);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testRegisterUser(); 