const express = require('express');
const { getHospitalProfile, updateInventory, getAllHospitals, getHospitalById, addReview, requestBlood } = require('../controllers/hospitalController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/profile', authMiddleware, getHospitalProfile);
router.put('/inventory', authMiddleware, updateInventory);
router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.post('/:id/reviews', authMiddleware, addReview);
router.post('/:hospitalId/request-blood', requestBlood);

module.exports = router;
