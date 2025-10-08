import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId
  jobSeekerId: mongoose.Types.ObjectId
  employerId: mongoose.Types.ObjectId
  coverLetter: string
  resume: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const applicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  jobSeekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  resume: String,
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']
  },
  notes: String,
}, { timestamps: true })

applicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true })

export const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema)

