import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Employee'],
    default: 'Employee'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isManagerApprover: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

export { userSchema };
export const User = mongoose.model('User', userSchema);
export default User;
