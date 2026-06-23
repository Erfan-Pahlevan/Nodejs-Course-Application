const express = require("express");
const router = express.Router();
const upload = require("../config/multer.config");
const rateLimitMiddleware = require("../middlewares/rateLimit.middleware");

const { auth } = require("../middlewares/users/users.middleware");

const {
  validateRegister,
  validateLogin,
} = require("../middlewares/users/users.validation.middleware");

const {
  register,
  login,
  getProfile,
  uploadAvatar,
  getAllUsers,
  getUserDetail,
  updateUser,
  deleteUser,
} = require("../controllers/users/users.controllers");

router.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

router.post("/register",rateLimitMiddleware(15 * 60 * 1000, 20), validateRegister, register);
router.post("/login",rateLimitMiddleware(15 * 60 * 1000, 20), validateLogin, login);

router.get("/profile", auth, getProfile);
router.post("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);

router.get("/", getAllUsers);
router.get("/:id", getUserDetail);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
