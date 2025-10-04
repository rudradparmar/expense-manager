import express from 'express';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { authenticate as auth } from '../middleware/auth.js';

const router = express.Router();

// Get all expenses for current user (employee view)
router.get('/my-expenses', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ employeeId: req.user.id })
      .populate('employeeId', 'name email')
      .populate('approvals.approverId', 'name email')
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching user expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Get expenses for manager approval (pending expenses from team members)
router.get('/pending-approvals', auth, async (req, res) => {
  try {
    // Find users who report to this manager
    const teamMembers = await User.find({ managerId: req.user.id });
    const teamMemberIds = teamMembers.map(member => member._id);

    // Find pending expenses from team members
    const pendingExpenses = await Expense.find({
      employeeId: { $in: teamMemberIds },
      status: { $in: ['Pending', 'InProgress'] }
    })
      .populate('employeeId', 'name email')
      .populate('approvals.approverId', 'name email')
      .sort({ createdAt: -1 });

    res.json(pendingExpenses);
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// Get all expenses (admin view)
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status, userId, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    let query = { companyId: req.user.companyId };
    
    if (status) query.status = status;
    if (userId) query.employeeId = userId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate('employeeId', 'name email role')
      .populate('approvals.approverId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Expense.countDocuments(query);

    res.json({ expenses, total });
  } catch (error) {
    console.error('Error fetching all expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Get team expenses for manager reports
router.get('/team-expenses', auth, async (req, res) => {
  try {
    // Find users who report to this manager
    const teamMembers = await User.find({ managerId: req.user.id });
    const teamMemberIds = teamMembers.map(member => member._id);

    const { startDate, endDate, memberId, status } = req.query;
    
    let query = { employeeId: { $in: teamMemberIds } };
    
    if (memberId) query.employeeId = memberId;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate('employeeId', 'name email')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching team expenses:', error);
    res.status(500).json({ error: 'Failed to fetch team expenses' });
  }
});

// Create new expense
router.post('/', auth, async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;

    if (!amount || !currency || !date) {
      return res.status(400).json({ error: 'Amount, currency, and date are required' });
    }

    const expense = new Expense({
      employeeId: req.user.id,
      companyId: req.user.companyId,
      amount,
      currency,
      amountInCompanyCurrency: amount, // For now, assume same currency
      category,
      description,
      date: new Date(date),
      status: 'Pending'
    });

    await expense.save();
    await expense.populate('employeeId', 'name email');

    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update expense (approve/reject)
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const { comment } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Check if user can approve this expense
    const employee = await User.findById(expense.employeeId);
    if (req.user.role !== 'Admin' && employee.managerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to approve this expense' });
    }

    // Add approval
    expense.approvals.push({
      approverId: req.user.id,
      status: 'Approved',
      comment,
      date: new Date()
    });

    expense.status = 'Approved';
    await expense.save();
    await expense.populate(['employeeId', 'approvals.approverId']);

    res.json(expense);
  } catch (error) {
    console.error('Error approving expense:', error);
    res.status(500).json({ error: 'Failed to approve expense' });
  }
});

router.put('/:id/reject', auth, async (req, res) => {
  try {
    const { comment } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Check if user can reject this expense
    const employee = await User.findById(expense.employeeId);
    if (req.user.role !== 'Admin' && employee.managerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to reject this expense' });
    }

    // Add rejection
    expense.approvals.push({
      approverId: req.user.id,
      status: 'Rejected',
      comment,
      date: new Date()
    });

    expense.status = 'Rejected';
    await expense.save();
    await expense.populate(['employeeId', 'approvals.approverId']);

    res.json(expense);
  } catch (error) {
    console.error('Error rejecting expense:', error);
    res.status(500).json({ error: 'Failed to reject expense' });
  }
});

// Admin override expense status
router.put('/:id/override', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { status, comment } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    expense.approvals.push({
      approverId: req.user.id,
      status: status === 'Approved' ? 'Approved' : 'Rejected',
      comment: comment || 'Admin override',
      date: new Date()
    });

    expense.status = status;
    await expense.save();
    await expense.populate(['employeeId', 'approvals.approverId']);

    res.json(expense);
  } catch (error) {
    console.error('Error overriding expense:', error);
    res.status(500).json({ error: 'Failed to override expense' });
  }
});

// Delete expense (employee can delete only pending expenses)
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Check ownership and status
    if (expense.employeeId.toString() !== req.user.id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to delete this expense' });
    }

    if (expense.status !== 'Pending' && req.user.role !== 'Admin') {
      return res.status(400).json({ error: 'Cannot delete processed expenses' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Get expense statistics
router.get('/stats', auth, async (req, res) => {
  try {
    let query = { companyId: req.user.companyId };

    // If not admin, limit to user's expenses or team expenses
    if (req.user.role === 'Employee') {
      query.employeeId = req.user.id;
    } else if (req.user.role === 'Manager') {
      const teamMembers = await User.find({ managerId: req.user.id });
      const teamMemberIds = teamMembers.map(member => member._id);
      query.employeeId = { $in: teamMemberIds };
    }

    const stats = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] }
          },
          approvedAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, '$amount', 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalExpenses: 0,
      totalAmount: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      pendingAmount: 0,
      approvedAmount: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching expense stats:', error);
    res.status(500).json({ error: 'Failed to fetch expense statistics' });
  }
});

export default router;