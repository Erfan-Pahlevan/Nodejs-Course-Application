const userModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findPost } = require("./posts.service");

async function createToken(findUser, JWTSECRET) {
  return jwt.sign(
    {
      userId: findUser._id,
    },
    JWTSECRET,
  );
}

const verifyToken = async (token, JWTSECRET) => {
  return jwt.verify(token, JWTSECRET);
};

const findUsername = async (username) => {
  return userModel.findOne({ username }).select("+password");
};

const findUserById = async (userId) => {
  return userModel.findById(userId).populate("image");
};

const isValidPassword = async (password, findUser) => {
  return bcrypt.compare(password, findUser.password);
};

async function setImage(fileId, userId) {
  const findUser = await findUserById(userId);
  findUser.image = fileId;
  await findUser.save();
  return findUser;
}

const registerUser = async (username, password, role) => {
  if (!username || !password) {
    throw new Error("username and password are required");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    password: hashedPassword,
    role,
  });
  return user;
};

const findAllUsers = async ({ page, limit, role, search, sort }) => {
  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (search) {
    filter.username = {
      $regex: search,
      $options: "i",
    };
  }

  const options = {
    page,
    limit,
  };

  return userModel.paginate(filter, options);
};

const deleteUser = async (id) => {
  return userModel.findByIdAndDelete(id);
};

module.exports = {
  createToken,
  verifyToken,
  findUsername,
  findUserById,
  isValidPassword,
  registerUser,
  setImage,
  findAllUsers,
  deleteUser,
};
