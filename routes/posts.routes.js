const express = require("express");
const router = express.Router();

const {
  auth,
  role,
  isOwner,
} = require("../middlewares/users/users.middleware");

const { validateCreatePost ,validateDeletePost } = require("../middlewares/posts/posts.validation.middleware");

const {
  post,
  getPostDetail,
  getAll,
  deleteOnePost,
} = require("../controllers/posts/posts.controllers");

router.post("/create", auth, validateCreatePost, post);
router.get("/get-detail/:postId", getPostDetail); // should get id information from params and show details
router.get("/get-list", getAll);
router.delete("/delete-by-admin", auth, role(["admin"]),validateDeletePost, deleteOnePost);
router.delete(
  "/delete-my-post",
  auth,
  validateDeletePost,
  isOwner,
  role(["admin", "user"]),
  deleteOnePost,
);

module.exports = router;
