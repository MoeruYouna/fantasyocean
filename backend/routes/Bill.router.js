const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill.model');

// Get all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().populate('userId items.productId');
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific bill by ID
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('userId items.productId');
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new bill
router.post('/', async (req, res) => {
    const { userId, items } = req.body;
  
    // Calculate total price
    const totalPrice = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  
    const newBill = new Bill({
      userId,
      items,
      totalPrice,
      status: 'In Process', 
    });
  
    try {
      const savedBill = await newBill.save();
      res.status(201).json(savedBill);
    } catch (error) {
      console.error('Error creating bill:', error);
      res.status(500).json({ message: 'Failed to create bill.' });
    }
  });
  

  // Route for updating the status
router.put('/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
  
      let bill = await Bill.findById(req.params.id);
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }
  
      // Update only the status
      bill.status = status;
      const updatedBill = await bill.save();
  
      res.json(updatedBill);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
  // Delete a bill (only if status is not "In Process" or "On Delivery")
router.delete('/:id', async (req, res) => {
    try {
      const bill = await Bill.findById(req.params.id);
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }
  
      // Check bill status before allowing deletion
      if (bill.status === 'In Process' || bill.status === 'On Delivery') {
        return res.status(400).json({ message: 'Cannot delete a bill that is In Process or On Delivery' });
      }
  
      await bill.remove();
      res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
