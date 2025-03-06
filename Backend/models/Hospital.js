const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  hospitalName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  location: { type: String, required: true },
  inventory: {
    blood: { type: Number, default: 0 },
    organs: { type: Number, default: 0 },
  },
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
