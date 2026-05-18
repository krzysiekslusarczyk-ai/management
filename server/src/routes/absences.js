const express = require('express');
const router = express.Router();
const {
  getAllAbsences,
  createAbsence,
  updateAbsence,
  approveAbsence,
  deleteAbsence
} = require('../controllers/absenceController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, getAllAbsences);
router.post('/', authenticate, createAbsence);
router.put('/:id', authenticate, updateAbsence);
router.post('/:id/approve', authenticate, authorize('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK'), approveAbsence);
router.delete('/:id', authenticate, deleteAbsence);

module.exports = router;
