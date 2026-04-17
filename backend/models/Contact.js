// backend/models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' } // Helps admins track what they've seen!
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);