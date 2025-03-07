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
  try {
    const hospital = await Hospital.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Update inventory with the new values
    hospital.inventory = {
      ...hospital.inventory,
      ...req.body
    };

    const updatedHospital = await hospital.save();
    
    // Return the updated inventory
    res.json({ 
      message: 'Inventory updated successfully',
      inventory: updatedHospital.inventory 
    });
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ message: 'Error updating inventory' });
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

const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).select('-password');
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (err) {
    console.error('Error fetching hospital:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getHospitalProfile, 
  updateInventory, 
  getAllHospitals,
  getHospitalById  // Add this export
};
