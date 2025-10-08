import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  userType: 'jobseeker' | 'employer'
  firstName: string
  lastName: string
  country: string
  createdAt: Date
  updatedAt: Date
}

export interface IJobSeekerProfile extends Document {
  userId: mongoose.Types.ObjectId
  phone?: string
  location: string
  bio?: string
  desiredJobTitle?: string
  skills: string[]
  experience: {
    title: string
    company: string
    location: string
    startDate: Date
    endDate?: Date
    current: boolean
    description: string
  }[]
  education: {
    degree: string
    institution: string
    location: string
    startDate: Date
    endDate?: Date
    current: boolean
  }[]
  portfolio: {
    title: string
    description: string
    url: string
    image?: string
  }[]
  resume?: string
  linkedIn?: string
  github?: string
  website?: string
  availability: 'immediate' | '2weeks' | '1month' | 'not-looking'
  desiredSalary?: number
  currency: string
  createdAt: Date
  updatedAt: Date
}

export interface IEmployerProfile extends Document {
  userId: mongoose.Types.ObjectId
  companyName: string
  companyWebsite?: string
  companySize: string
  industry: string
  location: string
  description?: string
  logo?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ['jobseeker', 'employer'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
}, { timestamps: true })

const jobSeekerProfileSchema = new Schema<IJobSeekerProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: String,
  location: { type: String, required: true },
  bio: String,
  desiredJobTitle: String,
  skills: [String],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    location: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    current: { type: Boolean, default: false },
  }],
  portfolio: [{
    title: String,
    description: String,
    url: String,
    image: String,
  }],
  resume: String,
  linkedIn: String,
  github: String,
  website: String,
  availability: { 
    type: String, 
    enum: ['immediate', '2weeks', '1month', 'not-looking'],
    default: 'immediate'
  },
  desiredSalary: Number,
  currency: { type: String, default: 'USD' },
}, { timestamps: true })

const employerProfileSchema = new Schema<IEmployerProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true },
  companyWebsite: String,
  companySize: String,
  industry: String,
  location: { type: String, required: true },
  description: String,
  logo: String,
}, { timestamps: true })

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
export const JobSeekerProfile: Model<IJobSeekerProfile> = mongoose.models.JobSeekerProfile || mongoose.model<IJobSeekerProfile>('JobSeekerProfile', jobSeekerProfileSchema)
export const EmployerProfile: Model<IEmployerProfile> = mongoose.models.EmployerProfile || mongoose.model<IEmployerProfile>('EmployerProfile', employerProfileSchema)

