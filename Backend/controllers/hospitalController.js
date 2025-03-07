const Hospital = require('../models/Hospital.js');
const BloodRequest = require('../models/BloodRequest.js');
const { sendBloodRequest } = require('../utils/emailService.js');

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

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const hospital = await Hospital.findById(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Use the name from the JWT token
    const review = {
      userName: req.user.name,  // This comes from the JWT token now
      rating,
      comment,
      date: new Date()
    };

    hospital.reviews.unshift(review);  // Add new review at the beginning
    await hospital.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: 'Error adding review' });
  }
};

const requestBlood = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { patientName, bloodGroup, unitsRequired } = req.body;

    // Input validation
    if (!patientName || !bloodGroup || !unitsRequired) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Check if hospital has enough blood units
    const bloodGroupMapping = {
      'A+': 'aPositive',
      'A-': 'aNegative',
      'B+': 'bPositive',
      'B-': 'bNegative',
      'AB+': 'abPositive',
      'AB-': 'abNegative',
      'O+': 'oPositive',
      'O-': 'oNegative'
    };

    const inventoryKey = bloodGroupMapping[bloodGroup];
    if (!inventoryKey || hospital.inventory[inventoryKey] < unitsRequired) {
      return res.status(400).json({ 
        message: 'Requested blood units not available' 
      });
    }

    // Create blood request
    const bloodRequest = new BloodRequest({
      patientName,
      bloodGroup,
      unitsRequired,
      hospital: hospitalId
    });
    await bloodRequest.save();

    // Send email notification
    try {
      await sendBloodRequest(hospital.email, {
        patientName,
        bloodGroup,
        unitsRequired,
        replyTo: process.env.EMAIL_USER
      });
      console.log("Here i am ");
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with the request even if email fails
    }

    res.status(201).json({ 
      message: 'Blood request sent successfully',
      requestId: bloodRequest._id
    });
  } catch (error) {
    console.error('Blood request error:', error);
    res.status(500).json({ 
      message: 'Error processing blood request',
      error: error.message 
    });
  }
};

module.exports = { 
  getHospitalProfile, 
  updateInventory, 
  getAllHospitals,
  getHospitalById,
  addReview,
  requestBlood
};
