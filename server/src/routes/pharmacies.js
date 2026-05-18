const express = require('express');
const router = express.Router();
const {
  getAllPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  assignUserToPharmacy
} = require('../controllers/pharmacyController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, getAllPharmacies);
router.get('/:id', authenticate, getPharmacyById);
router.post('/', authenticate, authorize('ADMINISTRATOR', 'MANAGER'), createPharmacy);
router.put('/:id', authenticate, authorize('ADMINISTRATOR', 'MANAGER'), updatePharmacy);
router.post('/:pharmacyId/users', authenticate, authorize('ADMINISTRATOR', 'MANAGER'), assignUserToPharmacy);

module.exports = router;
