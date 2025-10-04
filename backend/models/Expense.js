import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema({
  approverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  comment: {
    type: String,
    trim: true
  },
  date: {
    type: Date
  }
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  amountInCompanyCurrency: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  approvalFlowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApprovalFlow'
  },
  currentApprovalStep: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'InProgress', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvals: [approvalSchema],
  ocrReceiptId: {
    type: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

export { expenseSchema };
export const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
