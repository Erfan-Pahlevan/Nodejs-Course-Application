const express = require("express");
const router = express.Router();

const {
  auth,
  role,
  isOwner,
} = require("../middlewares/users/users.middleware");

const {
  validateCreatePost,
  validateDeletePost,
} = require("../middlewares/posts/posts.validation.middleware");

const {
  createPost,
  getPost,
  getAllPosts,
  deletePost,
} = require("../controllers/posts/posts.controllers");

router.post("/create", auth, validateCreatePost, createPost);
router.get("/get-detail/:postId", getPost);
router.get("/get-list", getAllPosts);
router.delete(
  "/delete-by-admin/:postId",
  auth,
  role(["admin"]),
  validateDeletePost,
  deletePost,
);
router.delete(
  "/delete-my-post/:postId",
  auth,
  validateDeletePost,
  isOwner,
  role(["admin", "user"]),
  deletePost,
);

module.exports = router;
