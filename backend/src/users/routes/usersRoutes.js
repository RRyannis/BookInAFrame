// const { createUserAndProfile } = require("../controllers/usersController");
// const express = require('express');
// const { requireAuth }=require("../../middlewares/auth");

// const router = express.Router();

// router.post('/profiles', createUserAndProfile);

// module.exports = router;
// src/users/routes/usersRoutes.js
const express = require('express');
const { createUserAndProfile } = require('../controllers/usersController');

const router = express.Router();

// POST /users/profiles
router.post('/profiles', createUserAndProfile);

module.exports = router;
