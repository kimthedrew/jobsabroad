# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up MongoDB

### Option A: Using MongoDB Locally

1. Install MongoDB on your system
2. Start MongoDB:
   ```bash
   sudo systemctl start mongod
   ```

### Option B: Using MongoDB Atlas (Recommended for beginners)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (choose the free tier)
4. Click "Connect" and select "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Update the `MONGODB_URI` in `.env.local`

## Step 3: Configure Environment Variables

The `.env.local` file is already created with default values. For production, update these values:

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=generate-a-random-secret-key
NEXTAUTH_SECRET=generate-another-random-secret-key
NEXTAUTH_URL=http://localhost:3000
```

To generate secure secret keys, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Run the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser

## Step 5: Create Your First Accounts

### Job Seeker Account
1. Click "Get Started" or "I'm Looking for Work"
2. Fill in your details (Country must be Kenya)
3. Explore jobs and apply!

### Employer Account
1. Click "I'm Hiring"
2. Fill in your company details
3. Post your first job!

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your connection string in `.env.local`
- Ensure your IP is whitelisted in MongoDB Atlas

### Port Already in Use
```bash
# Kill the process using port 3000
sudo lsof -ti:3000 | xargs kill -9

# Or run on a different port
npm run dev -- -p 3001
```

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Default Test Accounts (After First Setup)

You can create test accounts to explore the platform:

**Job Seeker:**
- Email: jobseeker@test.com
- Password: test123
- Country: Kenya

**Employer:**
- Email: employer@test.com  
- Password: test123
- Country: USA

## Next Steps

1. Customize the branding (colors, logo, etc.)
2. Set up email notifications
3. Deploy to production (Vercel, Railway, etc.)
4. Configure custom domain
5. Add analytics tracking

## Need Help?

Check the main README.md for detailed documentation or create an issue in the repository.

