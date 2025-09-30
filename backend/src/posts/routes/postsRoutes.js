const { getPosts, getPost } = require("../controllers/postsController");
const{ requireAuth }=require("../../middlewares/auth");

const getPostsRoute = ('/posts', getPosts);
const getPostRoute = ('/posts/:id', getPost);

module.exports = {
    getPostsRoute,
    getPostRoute
};