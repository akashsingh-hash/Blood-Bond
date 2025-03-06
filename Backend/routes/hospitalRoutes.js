const express = require('express');
const { getHospitalProfile, updateInventory, getAllHospitals } = require('../controllers/hospitalController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/profile', authMiddleware, getHospitalProfile);
router.put('/inventory', authMiddleware, updateInventory);
router.get('/', getAllHospitals);

module.exports = router;
