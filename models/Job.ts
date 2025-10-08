import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IJob extends Document {
  employerId: mongoose.Types.ObjectId
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  type: 'full-time' | 'part-time' | 'contract' | 'freelance'
  location: string
  remote: boolean
  salary: {
    min: number
    max: number
    currency: string
  }
  skills: string[]
  experience: string
  category: string
  status: 'active' | 'closed' | 'draft'
  applications: number
  views: number
  createdAt: Date
  updatedAt: Date
}

const jobSchema = new Schema<IJob>({
  employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  responsibilities: [String],
  type: { 
    type: String, 
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'freelance']
  },
  location: { type: String, required: true },
  remote: { type: Boolean, default: false },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  skills: [String],
  experience: String,
  category: { type: String, required: true },
  status: { 
    type: String, 
    default: 'active',
    enum: ['active', 'closed', 'draft']
  },
  applications: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true })

jobSchema.index({ title: 'text', description: 'text' })

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema)

