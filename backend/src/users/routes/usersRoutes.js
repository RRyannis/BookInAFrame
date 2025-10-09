const express = require('express');
const { createUserAndProfile, getUsers, getUser } = require('../controllers/usersController');

const router = express.Router();

router.get('/profiles', getUsers);
router.get('/profiles/:id', getUser);
router.post('/profiles', createUserAndProfile);

module.exports = router;
