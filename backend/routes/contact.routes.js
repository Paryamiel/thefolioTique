// backend/routes/contact.routes.js
const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

// POST /api/contacts — Public: Submit a contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = await Contact.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully!', data: newContact });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

module.exports = router;