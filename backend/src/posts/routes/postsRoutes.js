const express = require('express');
const { getPosts, getPost, createPost } = require("../controllers/postsController");
const { requireAuth }=require("../../middlewares/auth");

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/:id', getPost);
router.post('/posts', createPost);

module.exports = router;