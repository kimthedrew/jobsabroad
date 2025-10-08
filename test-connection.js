const mongoose = require('mongoose');

// Replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kimutai848_db_user:today1234@majuu.w6xltyh.mongodb.net/?retryWrites=true&w=majority&appName=majuu';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log('📡 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log
    
    // Set connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = mongoose.connection.db;
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections found:', collections.map(c => c.name));
    
    // Test a simple operation
    const result = await db.admin().ping();
    console.log('🏓 Ping result:', result);
    
    // Get database stats
    const stats = await db.stats();
    console.log('📊 Database stats:');
    console.log(`   - Database name: ${stats.db}`);
    console.log(`   - Collections: ${stats.collections}`);
    console.log(`   - Data size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    
    // Test creating a simple document
    console.log('🧪 Testing document creation...');
    const testCollection = db.collection('connection_test');
    const testDoc = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Connection test successful'
    });
    console.log('✅ Test document created:', testDoc.insertedId);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: testDoc.insertedId });
    console.log('🧹 Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    console.log('🎉 Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    // Detailed error analysis
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication Error Details:');
      console.log('   - Username or password is incorrect');
      console.log('   - Database user may not exist');
      console.log('   - User may not have proper permissions');
      console.log('\n💡 Solutions:');
      console.log('   1. Double-check username: kimutai848_db_user');
      console.log('   2. Verify password: MFCJjrTPu72q6o5g');
      console.log('   3. Check if user exists in Database Access');
      console.log('   4. Ensure user has "Read and write to any database" permission');
      
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Network Error Details:');
      console.log('   - Cluster hostname not found');
      console.log('   - Internet connection issue');
      console.log('   - Cluster may be paused or deleted');
      console.log('\n💡 Solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify cluster name in connection string');
      console.log('   3. Ensure cluster is running in MongoDB Atlas');
      
    } else if (error.message.includes('IP not in whitelist')) {
      console.log('\n🔧 IP Whitelist Error:');
      console.log('   - Your IP address is not whitelisted');
      console.log('\n💡 Solutions:');
      console.log('   1. Go to Network Access in MongoDB Atlas');
      console.log('   2. Add your current IP address');
      console.log('   3. Or temporarily add 0.0.0.0/0 (allow from anywhere)');
      
    } else {
      console.log('\n🔧 Other Error:');
      console.log('   - Check connection string format');
      console.log('   - Verify all parameters are correct');
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection();
