# JobsAbroad - Connect Kenyan Talent with Global Opportunities

JobsAbroad is a job platform specifically designed to connect talented Kenyan professionals with employers from around the world. The platform highlights the renowned work ethic and dedication of Kenyan workers while providing employers worldwide access to this exceptional talent pool.

## Features

### For Job Seekers (Kenyan Professionals)
- ✅ Create detailed professional profiles
- ✅ Browse and search job opportunities from global employers
- ✅ Apply to jobs with custom cover letters
- ✅ Track application status in real-time
- ✅ Manage profile, skills, experience, and portfolio

### For Employers (Worldwide)
- ✅ Post job openings with detailed requirements
- ✅ Review applications from qualified Kenyan professionals
- ✅ Manage job postings (edit, close, or delete)
- ✅ Track application metrics (views, applications)
- ✅ Update application status (pending, reviewed, shortlisted, accepted, rejected)

### Platform Features
- ✅ User authentication (separate flows for job seekers and employers)
- ✅ Job search and filtering (by category, type, location, remote)
- ✅ Beautiful, responsive UI built with Tailwind CSS
- ✅ RESTful API architecture
- ✅ MongoDB database for scalability
- ✅ Server-side rendering with Next.js 14

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Icons**: React Icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobsabroad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/jobsabroad
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   ```

   **Important**: Change these secret keys in production!

4. **Set up MongoDB**

   **Option A: Local MongoDB**
   - Install MongoDB locally
   - Start the MongoDB service:
     ```bash
     # On Linux/Mac
     sudo systemctl start mongod
     
     # Or use MongoDB Compass for a GUI interface
     ```

   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   - Update `MONGODB_URI` in `.env.local` with your Atlas connection string

## Running the Application

1. **Development mode**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

2. **Production build**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
jobsabroad/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── jobs/                 # Job management endpoints
│   │   └── applications/         # Application management endpoints
│   ├── auth/                     # Auth pages (login, register)
│   ├── dashboard/                # Dashboard pages
│   │   ├── jobseeker/           # Job seeker dashboard
│   │   └── employer/            # Employer dashboard
│   ├── jobs/                     # Job listing and detail pages
│   ├── about/                    # About page
│   ├── talent/                   # Talent showcase page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   └── Navbar.tsx               # Navigation component
├── lib/                         # Utility functions
│   └── mongodb.ts               # MongoDB connection
├── models/                      # Mongoose models
│   ├── User.ts                  # User and profile models
│   ├── Job.ts                   # Job model
│   └── Application.ts           # Application model
├── public/                      # Static files
├── .env.local                   # Environment variables (create this)
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Usage Guide

### For Job Seekers

1. **Register**
   - Go to the homepage
   - Click "I'm Looking for Work" or "Get Started"
   - Fill in your information (must be from Kenya)
   - Create your account

2. **Browse Jobs**
   - Navigate to "Find Jobs" in the navigation menu
   - Use search and filters to find relevant opportunities
   - Click on any job to see full details

3. **Apply to Jobs**
   - Click "Apply Now" on a job posting
   - Write a compelling cover letter
   - Submit your application
   - Track your applications in your dashboard

4. **Manage Your Profile**
   - Go to your dashboard
   - Click "Edit Profile"
   - Add skills, experience, education, and portfolio items
   - Keep your profile updated to attract employers

### For Employers

1. **Register**
   - Go to the homepage
   - Click "I'm Hiring" or "Get Started"
   - Select "Employer" as your account type
   - Fill in your company information
   - Create your account

2. **Post a Job**
   - Go to your dashboard
   - Click "Post a Job"
   - Fill in job details:
     - Title, description, requirements
     - Job type, location, salary range
     - Required skills and experience
   - Publish or save as draft

3. **Review Applications**
   - Go to "View Applications" from your dashboard
   - Review candidate profiles and cover letters
   - Update application status:
     - Pending → Reviewed → Shortlisted → Accepted/Rejected
   - Contact candidates for interviews

4. **Manage Job Postings**
   - View all your jobs in the dashboard
   - Edit job details anytime
   - Close jobs when position is filled
   - Track views and applications

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `POST /api/jobs` - Create new job (employer only)
- `GET /api/jobs/:id` - Get single job
- `PUT /api/jobs/:id` - Update job (owner only)
- `DELETE /api/jobs/:id` - Delete job (owner only)
- `GET /api/jobs/my-jobs` - Get employer's jobs

### Applications
- `GET /api/applications` - Get user's applications
- `POST /api/applications` - Create new application (job seeker only)
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id` - Update application status (employer only)

## Database Models

### User
- email, password, userType (jobseeker/employer)
- firstName, lastName, country
- Timestamps

### JobSeekerProfile
- userId (reference to User)
- location, bio, skills
- experience, education, portfolio
- resume, social links
- availability, desired salary

### EmployerProfile
- userId (reference to User)
- companyName, companyWebsite
- companySize, industry
- location, description, logo

### Job
- employerId (reference to User)
- title, description
- requirements, responsibilities
- type, location, remote
- salary, skills, experience
- category, status
- applications count, views

### Application
- jobId, jobSeekerId, employerId
- coverLetter, resume
- status (pending/reviewed/shortlisted/accepted/rejected)
- notes

## Security Features

- Password hashing with bcrypt
- JWT authentication with HTTP-only cookies
- Protected API routes with authentication middleware
- Input validation and sanitization
- Secure user sessions

## Future Enhancements

- [ ] Email notifications for applications
- [ ] Direct messaging between employers and job seekers
- [ ] Advanced search with AI-powered matching
- [ ] Video introductions for job seekers
- [ ] Company verification badges
- [ ] Skill assessments and certifications
- [ ] Payment integration for premium features
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard for employers
- [ ] Job recommendations based on profile

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please contact [your-email@example.com] or create an issue in the repository.

---

Built with ❤️ to empower Kenyan talent and connect them with global opportunities.

# jobsabroad
