import express from 'express';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
import { authenticate as auth } from '../middleware/auth.js';

const router = express.Router();

// Get expense summary report
router.get('/expense-summary', auth, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;
    
    let query = { companyId: req.user.companyId };
    
    // Filter by user role
    if (req.user.role === 'Employee') {
      query.employeeId = req.user.id;
    } else if (req.user.role === 'Manager') {
      const teamMembers = await User.find({ managerId: req.user.id });
      const teamMemberIds = teamMembers.map(member => member._id);
      query.employeeId = { $in: teamMemberIds };
    }
    
    // Date filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const summary = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          approvedAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, '$amount', 0] }
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] }
          },
          rejectedAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, '$amount', 0] }
          },
          avgExpenseAmount: { $avg: '$amount' }
        }
      }
    ]);

    res.json(summary[0] || {
      totalExpenses: 0,
      totalAmount: 0,
      approvedAmount: 0,
      pendingAmount: 0,
      rejectedAmount: 0,
      avgExpenseAmount: 0
    });
  } catch (error) {
    console.error('Error generating expense summary:', error);
    res.status(500).json({ error: 'Failed to generate expense summary' });
  }
});

// Get category-wise breakdown
router.get('/category-breakdown', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { companyId: req.user.companyId };
    
    if (req.user.role === 'Employee') {
      query.employeeId = req.user.id;
    } else if (req.user.role === 'Manager') {
      const teamMembers = await User.find({ managerId: req.user.id });
      const teamMemberIds = teamMembers.map(member => member._id);
      query.employeeId = { $in: teamMemberIds };
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const breakdown = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          approvedAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, '$amount', 0] }
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] }
          }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.json(breakdown);
  } catch (error) {
    console.error('Error generating category breakdown:', error);
    res.status(500).json({ error: 'Failed to generate category breakdown' });
  }
});

// Get monthly trends
router.get('/monthly-trends', auth, async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    let query = { 
      companyId: req.user.companyId,
      date: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    };
    
    if (req.user.role === 'Employee') {
      query.employeeId = req.user.id;
    } else if (req.user.role === 'Manager') {
      const teamMembers = await User.find({ managerId: req.user.id });
      const teamMemberIds = teamMembers.map(member => member._id);
      query.employeeId = { $in: teamMemberIds };
    }

    const trends = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $month: '$date' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          approvedAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, '$amount', 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing months with zero values
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const fullTrends = monthNames.map((month, index) => {
      const monthData = trends.find(t => t._id === index + 1);
      return {
        month,
        count: monthData ? monthData.count : 0,
        totalAmount: monthData ? monthData.totalAmount : 0,
        approvedAmount: monthData ? monthData.approvedAmount : 0
      };
    });

    res.json(fullTrends);
  } catch (error) {
    console.error('Error generating monthly trends:', error);
    res.status(500).json({ error: 'Failed to generate monthly trends' });
  }
});

// Get team member expense report (for managers)
router.get('/team-member-report', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Manager' && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { startDate, endDate } = req.query;
    
    let teamMembers;
    if (req.user.role === 'Manager') {
      teamMembers = await User.find({ managerId: req.user.id });
    } else {
      teamMembers = await User.find({ companyId: req.user.companyId, role: 'Employee' });
    }
    
    const teamMemberIds = teamMembers.map(member => member._id);
    
    let dateQuery = {};
    if (startDate || endDate) {
      if (startDate) dateQuery.$gte = new Date(startDate);
      if (endDate) dateQuery.$lte = new Date(endDate);
    }

    const memberReports = await Promise.all(
      teamMembers.map(async (member) => {
        let query = { employeeId: member._id };
        if (Object.keys(dateQuery).length > 0) {
          query.date = dateQuery;
        }

        const stats = await Expense.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              totalExpenses: { $sum: 1 },
              totalAmount: { $sum: '$amount' },
              approvedAmount: {
                $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, '$amount', 0] }
              },
              pendingAmount: {
                $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] }
              },
              rejectedAmount: {
                $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, '$amount', 0] }
              }
            }
          }
        ]);

        return {
          member: {
            id: member._id,
            name: member.name,
            email: member.email
          },
          stats: stats[0] || {
            totalExpenses: 0,
            totalAmount: 0,
            approvedAmount: 0,
            pendingAmount: 0,
            rejectedAmount: 0
          }
        };
      })
    );

    res.json(memberReports);
  } catch (error) {
    console.error('Error generating team member report:', error);
    res.status(500).json({ error: 'Failed to generate team member report' });
  }
});

// Get top expenses report
router.get('/top-expenses', auth, async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    
    let query = { companyId: req.user.companyId };
    
    if (req.user.role === 'Employee') {
      query.employeeId = req.user.id;
    } else if (req.user.role === 'Manager') {
      const teamMembers = await User.find({ managerId: req.user.id });
      const teamMemberIds = teamMembers.map(member => member._id);
      query.employeeId = { $in: teamMemberIds };
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const topExpenses = await Expense.find(query)
      .populate('employeeId', 'name email')
      .sort({ amount: -1 })
      .limit(parseInt(limit));

    res.json(topExpenses);
  } catch (error) {
    console.error('Error generating top expenses report:', error);
    res.status(500).json({ error: 'Failed to generate top expenses report' });
  }
});

// Get approval rate report (for managers and admins)
router.get('/approval-rates', auth, async (req, res) => {
  try {
    if (req.user.role === 'Employee') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { startDate, endDate } = req.query;
    
    let query = { companyId: req.user.companyId };
    
    if (req.user.role === 'Manager') {
      const teamMembers = await User.find({ managerId: req.user.id });
      const teamMemberIds = teamMembers.map(member => member._id);
      query.employeeId = { $in: teamMemberIds };
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const approvalStats = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalExpenses = approvalStats.reduce((sum, stat) => sum + stat.count, 0);
    const approvalRates = approvalStats.map(stat => ({
      status: stat._id,
      count: stat.count,
      totalAmount: stat.totalAmount,
      percentage: totalExpenses > 0 ? ((stat.count / totalExpenses) * 100).toFixed(2) : 0
    }));

    res.json({ approvalRates, totalExpenses });
  } catch (error) {
    console.error('Error generating approval rates report:', error);
    res.status(500).json({ error: 'Failed to generate approval rates report' });
  }
});

export default router;
