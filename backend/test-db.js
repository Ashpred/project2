const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Test user data
const testUser = {
  fullName: 'Test User',
  username: 'testuser' + Math.floor(Math.random() * 10000),
  email: 'test' + Math.floor(Math.random() * 10000) + '@example.com',
  password: 'password123',
  isVerified: true
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    try {
      // Create and save test user
      console.log('Attempting to create test user:', {
        ...testUser,
        password: '[HIDDEN]'
      });
      
      const user = new User(testUser);
      const savedUser = await user.save();
      
      console.log('User saved successfully!');
      console.log('User ID:', savedUser._id);
      console.log('Username:', savedUser.username);
      console.log('Email:', savedUser.email);
      
      // Find the user to confirm it was saved
      const foundUser = await User.findById(savedUser._id);
      console.log('User retrieved from database:', foundUser ? 'YES' : 'NO');
      
      // List all users
      const allUsers = await User.find({}).select('username email createdAt');
      console.log('Total users in database:', allUsers.length);
      console.log('Recent users:');
      allUsers.slice(-5).forEach(user => {
        console.log(`- ${user.username} (${user.email}) - Created: ${user.createdAt}`);
      });
      
      console.log('Database test completed successfully!');
    } catch (error) {
      console.error('Error during database test:', error);
    } finally {
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('MongoDB Disconnected');
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  }); 