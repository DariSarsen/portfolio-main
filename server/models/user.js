const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  loginAttempts: { type: Number, default: 0 },
  blockedUntil: { type: Date, default: null } 
});

module.exports = mongoose.model('User', userSchema);
