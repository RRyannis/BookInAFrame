const express = require('express');
const { getPosts, getPost, createPost, updatePost, deletePost } = require("../controllers/postsController");
const { requireAuth }=require("../../middlewares/auth");

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/:id', getPost);
router.post('/posts', createPost);
router.patch('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

module.exports = router;