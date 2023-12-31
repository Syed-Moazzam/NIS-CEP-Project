const express = require('express');
const router = express.Router();

const { register, authenticateUser, authenticateUserByRole } = require('../controllers/auth');

router.post('/register', register);
router.post('/authenticate-user', authenticateUser);
router.post('/authenticate-user-by-role', authenticateUserByRole);

module.exports = router;