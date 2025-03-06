const Hospital = require('../models/Hospital.js');

const getHospitalProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id).select('-password');
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateInventory = async (req, res) => {
  const { blood, organs } = req.body;
  try {
    const hospital = await Hospital.findById(req.user.id);
    hospital.inventory.blood = blood;
    hospital.inventory.organs = organs;
    await hospital.save();
    res.json({ message: 'Inventory updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select('-password');
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getHospitalProfile, updateInventory, getAllHospitals };
