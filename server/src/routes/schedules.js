const express = require('express');
const router = express.Router();
const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  approveSchedule,
  publishSchedule
} = require('../controllers/scheduleController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, getAllSchedules);
router.get('/:id', authenticate, getScheduleById);
router.post('/', authenticate, authorize('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK'), createSchedule);
router.put('/:id', authenticate, authorize('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK'), updateSchedule);
router.post('/:id/approve', authenticate, authorize('ADMINISTRATOR', 'MANAGER'), approveSchedule);
router.post('/:id/publish', authenticate, authorize('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK'), publishSchedule);

module.exports = router;
