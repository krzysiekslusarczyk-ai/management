const express = require('express');
const router = express.Router();
const {
  getMyPreferences,
  getUserPreferences,
  createOrUpdatePreference,
  deletePreference
} = require('../controllers/preferenceController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/me', authenticate, getMyPreferences);
router.get('/user/:userId', authenticate, authorize('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK'), getUserPreferences);
router.post('/', authenticate, createOrUpdatePreference);
router.delete('/:id', authenticate, deletePreference);

module.exports = router;
