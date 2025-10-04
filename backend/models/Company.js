import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

export { companySchema };
export const Company = mongoose.model('Company', companySchema);
export default Company;
