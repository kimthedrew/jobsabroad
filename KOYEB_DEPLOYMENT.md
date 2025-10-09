# Koyeb Deployment Guide

## Environment Variables Required

Make sure to set these environment variables in your Koyeb dashboard:

### MongoDB Connection
```
MONGODB_URI=mongodb+srv://kimutai848_db_user:today1234@majuu.w6xltyh.mongodb.net/jobsabroad?retryWrites=true&w=majority&appName=majuu
```

### JWT Secret
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```
**Important:** Replace with a strong random string for production!

### Node Environment
```
NODE_ENV=production
```

## Recent Fixes for Deployment

### 1. Fixed Next.js Static Rendering Issues

All API routes that use cookies have been marked as dynamic with `export const dynamic = 'force-dynamic'`. This fixes the error:
> Route couldn't be rendered statically because it used `request.cookies`

**Files Updated:**
- `app/api/auth/me/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/jobs/route.ts`
- `app/api/jobs/[id]/route.ts`
- `app/api/jobs/my-jobs/route.ts`
- `app/api/applications/route.ts`
- `app/api/applications/[id]/route.ts`
- `app/api/profile/jobseeker/[id]/route.ts`

### 2. Fixed useSearchParams() Suspense Boundary Error

The register page now wraps `useSearchParams()` in a Suspense boundary. This fixes the error:
> useSearchParams() should be wrapped in a suspense boundary

**File Updated:**
- `app/auth/register/page.tsx` - Wrapped in `<Suspense>` with a loading fallback

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Fix deployment issues"
   git push origin main
   ```

2. **Set Environment Variables in Koyeb**
   - Go to your Koyeb app settings
   - Add the environment variables listed above
   - Make sure to use your actual MongoDB connection string

3. **Redeploy**
   - Koyeb should automatically redeploy when you push
   - Or manually trigger a redeploy from the dashboard

4. **Verify MongoDB Connection**
   - Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)
   - Or add Koyeb's IP addresses to your whitelist

## MongoDB Atlas Setup

1. **Database User**
   - Username: `kimutai848_db_user`
   - Password: `today1234`
   - Ensure user has read/write permissions

2. **Network Access**
   - Add IP: `0.0.0.0/0` (allows access from anywhere)
   - This is needed for Koyeb to connect

3. **Database Name**
   - Database: `jobsabroad`

## Troubleshooting

### Build Fails with "Dynamic server usage" error
- Make sure all API route files have `export const dynamic = 'force-dynamic'` at the top

### Build Fails with "useSearchParams" error
- Make sure the register page is wrapped in Suspense boundary

### MongoDB Connection Fails
- Verify your connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### App Builds but Crashes on Start
- Check Koyeb logs for errors
- Verify all environment variables are set correctly
- Make sure `NODE_ENV=production` is set

## Post-Deployment Checklist

- [ ] Environment variables are set in Koyeb
- [ ] MongoDB connection string is correct
- [ ] IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- [ ] JWT_SECRET is set to a strong value
- [ ] App builds successfully
- [ ] Can register a new user
- [ ] Can log in
- [ ] Navbar updates after login
- [ ] Can post a job (as employer)
- [ ] Can apply to jobs (as job seeker)

## Support

If you encounter any issues:
1. Check the Koyeb build logs
2. Check the Koyeb runtime logs
3. Verify MongoDB Atlas connection settings
4. Test locally first with `npm run build` to catch build errors early

