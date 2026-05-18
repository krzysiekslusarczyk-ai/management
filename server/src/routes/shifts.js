const express = require('express');
const router = express.Router();
const {
  createShift,
  updateShift,
  deleteShift,
  getShiftsBySchedule
} = require('../controllers/shiftController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/schedule/:scheduleId', authenticate, getShiftsBySchedule);
router.post('/', authenticate, authorize('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK'), createShift);
router.put('/:id', authenticate, authorize('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK'), updateShift);
router.delete('/:id', authenticate, authorize('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK'), deleteShift);

module.exports = router;
