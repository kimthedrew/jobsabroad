const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import your models
const { User, JobSeekerProfile, EmployerProfile } = require('./models/User');
const { Job } = require('./models/Job');
const { Application } = require('./models/Application');

// Replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kimutai848_db_user:MFCJjrTPu72q6o5g@cluster0.mongodb.net/jobsabroad?retryWrites=true&w=majority';

async function runMigrations() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Check if collections exist
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📁 Existing collections:', collections.map(c => c.name));
    
    // Create indexes for better performance
    console.log('🔍 Creating database indexes...');
    
    // User collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created unique index on users.email');
    
    // Job collection indexes
    await db.collection('jobs').createIndex({ title: 'text', description: 'text' });
    await db.collection('jobs').createIndex({ employerId: 1 });
    await db.collection('jobs').createIndex({ category: 1 });
    await db.collection('jobs').createIndex({ status: 1 });
    console.log('✅ Created indexes on jobs collection');
    
    // Application collection indexes
    await db.collection('applications').createIndex({ jobId: 1, jobSeekerId: 1 }, { unique: true });
    await db.collection('applications').createIndex({ jobSeekerId: 1 });
    await db.collection('applications').createIndex({ employerId: 1 });
    console.log('✅ Created indexes on applications collection');
    
    // JobSeekerProfile collection indexes
    await db.collection('jobseekerprofiles').createIndex({ userId: 1 }, { unique: true });
    console.log('✅ Created unique index on jobseekerprofiles.userId');
    
    // EmployerProfile collection indexes
    await db.collection('employerprofiles').createIndex({ userId: 1 }, { unique: true });
    console.log('✅ Created unique index on employerprofiles.userId');
    
    // Test creating a sample user
    console.log('👤 Creating test user...');
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('testpassword123', 10);
      
      const testUser = await User.create({
        email: 'test@example.com',
        password: hashedPassword,
        userType: 'jobseeker',
        firstName: 'Test',
        lastName: 'User',
        country: 'Kenya'
      });
      
      console.log('✅ Created test user:', testUser.email);
      
      // Create corresponding profile
      await JobSeekerProfile.create({
        userId: testUser._id,
        location: 'Nairobi, Kenya',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: [],
        education: [],
        portfolio: []
      });
      
      console.log('✅ Created test job seeker profile');
    } else {
      console.log('ℹ️  Test user already exists');
    }
    
    // Create a test employer
    console.log('🏢 Creating test employer...');
    const existingEmployer = await User.findOne({ email: 'employer@example.com' });
    
    if (!existingEmployer) {
      const hashedPassword = await bcrypt.hash('employer123', 10);
      
      const testEmployer = await User.create({
        email: 'employer@example.com',
        password: hashedPassword,
        userType: 'employer',
        firstName: 'Test',
        lastName: 'Employer',
        country: 'USA'
      });
      
      console.log('✅ Created test employer:', testEmployer.email);
      
      // Create corresponding employer profile
      await EmployerProfile.create({
        userId: testEmployer._id,
        companyName: 'Test Company Inc.',
        location: 'New York, USA',
        industry: 'Technology'
      });
      
      console.log('✅ Created test employer profile');
    } else {
      console.log('ℹ️  Test employer already exists');
    }
    
    // Create a test job
    console.log('💼 Creating test job...');
    const existingJob = await Job.findOne({ title: 'Software Developer' });
    
    if (!existingJob) {
      const testEmployer = await User.findOne({ email: 'employer@example.com' });
      
      const testJob = await Job.create({
        employerId: testEmployer._id,
        title: 'Software Developer',
        description: 'We are looking for a skilled software developer to join our team.',
        requirements: ['JavaScript experience', 'React knowledge', 'Good communication skills'],
        responsibilities: ['Develop web applications', 'Write clean code', 'Collaborate with team'],
        type: 'full-time',
        location: 'Remote',
        remote: true,
        salary: {
          min: 50000,
          max: 80000,
          currency: 'USD'
        },
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '2-5 years',
        category: 'Technology',
        status: 'active'
      });
      
      console.log('✅ Created test job:', testJob.title);
    } else {
      console.log('ℹ️  Test job already exists');
    }
    
    // Verify data
    console.log('\n📊 Database Summary:');
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    const jobSeekerCount = await JobSeekerProfile.countDocuments();
    const employerCount = await EmployerProfile.countDocuments();
    
    console.log(`👥 Users: ${userCount}`);
    console.log(`👨‍💼 Job Seekers: ${jobSeekerCount}`);
    console.log(`🏢 Employers: ${employerCount}`);
    console.log(`💼 Jobs: ${jobCount}`);
    console.log(`📝 Applications: ${applicationCount}`);
    
    console.log('\n🎉 Migration completed successfully!');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication Error - Check:');
      console.log('1. Username and password are correct');
      console.log('2. Cluster name in connection string matches Atlas');
      console.log('3. IP address is whitelisted in Network Access');
      console.log('4. Database user has proper permissions');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Network Error - Check:');
      console.log('1. Cluster name in connection string');
      console.log('2. Internet connection');
      console.log('3. MongoDB Atlas cluster is running');
    }
    
    process.exit(1);
  }
}

// Run migrations
runMigrations();
