const getPosts = require("../controllers/postsController");
const{ requireAuth }=require("../../middlewares/auth");

const routes = ('/posts', getPosts);

module.exports = routes;