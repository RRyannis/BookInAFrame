const express = require('express');
const { createUserAndProfile, getUsers } = require('../controllers/usersController');

const router = express.Router();

router.get('/profiles', getUsers)
router.post('/profiles', createUserAndProfile);

module.exports = router;
