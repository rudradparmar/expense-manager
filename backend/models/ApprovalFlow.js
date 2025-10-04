import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    trim: true
  },
  approverIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { _id: false });

const rulesSchema = new mongoose.Schema({
  percentageRule: {
    type: Number,
    min: 0,
    max: 100
  },
  specificApprover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hybrid: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const approvalFlowSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  steps: [stepSchema],
  rules: rulesSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

export { approvalFlowSchema };
export const ApprovalFlow = mongoose.model('ApprovalFlow', approvalFlowSchema);
export default ApprovalFlow;
