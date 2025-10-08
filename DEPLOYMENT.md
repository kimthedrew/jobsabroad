# Deployment Guide

This guide covers deploying JobsAbroad to production.

## Prerequisites

- MongoDB Atlas account (free tier available)
- Vercel account (recommended) or another hosting platform
- Domain name (optional)

## Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and offers a generous free tier.

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier is sufficient to start)
3. Create a database user (Database Access)
4. Whitelist all IPs (Network Access → Add IP → Allow Access from Anywhere: 0.0.0.0/0)
5. Get your connection string (Connect → Connect your application)

### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

5. Add Environment Variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=generate-a-secure-random-key
   NEXTAUTH_SECRET=generate-another-secure-random-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

6. Click "Deploy"

### Step 4: Verify Deployment

1. Visit your Vercel URL (e.g., jobsabroad.vercel.app)
2. Test registration for both job seekers and employers
3. Test job posting and application flow

### Step 5: Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to your custom domain

## Deploying to Railway

Railway is another excellent option for deploying Next.js apps.

### Step 1: Prepare Your Project

1. Sign up at https://railway.app
2. Create a new project
3. Connect your GitHub repository

### Step 2: Add MongoDB

1. In Railway dashboard, click "New"
2. Select "Database" → "MongoDB"
3. Copy the connection string from the MongoDB service

### Step 3: Configure Environment Variables

In your Railway project settings, add:
```
MONGODB_URI=<railway-mongodb-connection-string>
JWT_SECRET=<generate-secure-key>
NEXTAUTH_SECRET=<generate-secure-key>
NEXTAUTH_URL=<your-railway-url>
```

### Step 4: Deploy

Railway will automatically deploy your application.

## Deploying to DigitalOcean App Platform

### Step 1: Create App

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect your GitHub repository

### Step 2: Configure

- Type: Web Service
- Build Command: `npm run build`
- Run Command: `npm start`

### Step 3: Add Environment Variables

Same as Vercel/Railway configuration.

### Step 4: Add MongoDB

Use MongoDB Atlas or DigitalOcean's Managed MongoDB.

## Environment Variables for Production

Always use secure, randomly generated secrets in production:

```bash
# Generate secure keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Required variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Random secure string (32+ characters)
- `NEXTAUTH_SECRET` - Random secure string (32+ characters)
- `NEXTAUTH_URL` - Your production URL
- `NODE_ENV=production` (usually set automatically)

## Post-Deployment Checklist

- [ ] Test user registration (both job seeker and employer)
- [ ] Test user login
- [ ] Test job posting
- [ ] Test job application
- [ ] Test job search and filtering
- [ ] Verify email validation works
- [ ] Check mobile responsiveness
- [ ] Test all navigation links
- [ ] Verify database connections
- [ ] Set up monitoring (Vercel Analytics, LogRocket, etc.)
- [ ] Set up error tracking (Sentry)
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate (usually automatic)
- [ ] Create backup strategy for database

## Performance Optimization

1. **Enable caching**:
   - Vercel automatically handles this
   
2. **Image optimization**:
   - Use Next.js Image component (already implemented)
   
3. **Database indexing**:
   - Indexes are already set up in models
   
4. **CDN**:
   - Vercel provides this automatically

## Monitoring & Maintenance

### Vercel Analytics
- Enable in project settings for performance insights

### MongoDB Atlas Monitoring
- Monitor database performance in Atlas dashboard
- Set up alerts for high usage
- Enable backup (recommended for production)

### Error Tracking
Consider adding Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## Scaling Considerations

### Database
- Start with MongoDB Atlas M0 (free tier)
- Scale to M2/M5 as traffic grows
- Enable sharding for large datasets

### Application
- Vercel scales automatically
- Consider Edge Functions for better global performance
- Use Vercel's ISR (Incremental Static Regeneration) for job listings

### CDN & Caching
- Leverage Vercel's Edge Network
- Implement Redis for session caching (optional)

## Security Checklist

- [x] Environment variables not committed to Git
- [x] HTTPS enabled (automatic with Vercel)
- [x] JWT secrets are strong and unique
- [x] Password hashing implemented (bcrypt)
- [x] HTTP-only cookies for auth tokens
- [x] MongoDB connection uses credentials
- [ ] Rate limiting (consider adding)
- [ ] CORS configuration (add if needed)
- [ ] Input validation and sanitization
- [ ] SQL injection protection (MongoDB prevents this)

## Backup Strategy

### Database Backups
1. Enable automatic backups in MongoDB Atlas
2. Set backup frequency (daily recommended)
3. Test restore process periodically

### Code Backups
- Git repository serves as code backup
- Tag releases: `git tag -a v1.0.0 -m "Initial release"`

## Troubleshooting Production Issues

### Build Failures
- Check Node.js version matches locally
- Verify all dependencies are in package.json
- Review build logs in Vercel dashboard

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string format
- Ensure database user has proper permissions

### Authentication Issues
- Verify NEXTAUTH_URL matches your domain exactly
- Check JWT_SECRET is set correctly
- Clear browser cookies and try again

## Support & Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Railway Docs](https://docs.railway.app/)

---

Need help with deployment? Create an issue in the repository with the "deployment" label.

