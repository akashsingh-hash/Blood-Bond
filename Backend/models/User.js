const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  location: { type: String, required: true },
  organDonation: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
