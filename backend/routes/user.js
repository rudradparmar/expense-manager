import express from 'express';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { authenticate as auth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-passwordHash')
      .populate('companyId', 'name')
      .populate('managerId', 'name email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update current user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      updates.email = email;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    )
      .select('-passwordHash')
      .populate('companyId', 'name')
      .populate('managerId', 'name email');

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required' });
    }

    const user = await User.findById(req.user.id);
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(req.user.id, { passwordHash: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get team members (for managers)
router.get('/team', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Manager' && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    let query = {};
    if (req.user.role === 'Manager') {
      query.managerId = req.user.id;
    } else {
      query.companyId = req.user.companyId;
    }

    const teamMembers = await User.find(query)
      .select('-passwordHash')
      .populate('managerId', 'name email')
      .sort({ name: 1 });

    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get all users (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { role, limit = 50, offset = 0 } = req.query;
    let query = { companyId: req.user.companyId };
    
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-passwordHash')
      .populate('managerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await User.countDocuments(query);

    res.json({ users, total });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create new user (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, email, role, managerId, password } = req.body;

    if (!name || !email || !role || !password) {
      return res.status(400).json({ error: 'Name, email, role, and password are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Validate manager if provided
    if (managerId) {
      const manager = await User.findById(managerId);
      if (!manager || (manager.role !== 'Manager' && manager.role !== 'Admin')) {
        return res.status(400).json({ error: 'Invalid manager ID' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      passwordHash: hashedPassword,
      role,
      companyId: req.user.companyId,
      managerId: managerId || null
    });

    await user.save();
    
    const newUser = await User.findById(user._id)
      .select('-passwordHash')
      .populate('managerId', 'name email');

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, email, role, managerId } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (role) updates.role = role;
    if (managerId !== undefined) updates.managerId = managerId || null;
    
    if (email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      updates.email = email;
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      updates,
      { new: true, runValidators: true }
    )
      .select('-passwordHash')
      .populate('managerId', 'name email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Don't allow deleting self
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get managers list (for assigning managers to employees)
router.get('/managers', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const managers = await User.find({
      companyId: req.user.companyId,
      role: { $in: ['Manager', 'Admin'] }
    })
      .select('name email role')
      .sort({ name: 1 });

    res.json(managers);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ error: 'Failed to fetch managers' });
  }
});

export default router;
