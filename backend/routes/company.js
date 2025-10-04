import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create company
router.post('/', async (req, res) => {
  try {
    const { name, country, currency } = req.body;
    
    const company = new Company({
      name,
      country,
      currency
    });
    
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
