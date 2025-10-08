const mongoose = require('mongoose');

// Replace this with your actual connection string
const MONGODB_URI = 'mongodb+srv://kimutai848_db_user:MFCJjrTPu72q6o5g@cluster0.mongodb.net/jobsabroad?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test a simple operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Check your username and password');
      console.log('2. Verify your cluster name in the connection string');
      console.log('3. Make sure your IP is whitelisted in Network Access');
      console.log('4. Ensure the database user has proper permissions');
    }
  }
}

testConnection();
