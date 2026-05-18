const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('ADMINISTRATOR', 'MANAGER'), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, authorize('ADMINISTRATOR', 'MANAGER'), updateUser);
router.delete('/:id', authenticate, authorize('ADMINISTRATOR'), deleteUser);

module.exports = router;
