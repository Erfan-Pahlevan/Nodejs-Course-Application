const userService = require("../../services/users.service");

const fileService = require("../../services/files.service");

async function register(req, res) {
  try {
    const { username, password, role } = req.body;
    const findUser = await userService.findUsername(username);

    if (findUser) {
      return res.status(400).json({
        status: 400,
        message: "username already exists",
      });
    }

    const user = await userService.registerUser(username, password, role);

    res.status(201).json({
      message: "user created",
    });
  } catch (err) {
    return res.status(400).json({
      message: "Registration failed",
      error: err.message,
    });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  const findUser = await userService.findUsername(username);
  if (!findUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isValidPassword = await userService.isValidPassword(password, findUser);
  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = await userService.createToken(findUser, process.env.JWTSECRET);

  return res.json({
    token,
  });
}

async function profile(req, res) {
  const { userId } = req;

  const findUser = await userService.findUserById(userId);

  if (!findUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    user: findUser,
    image: findUser.image
      ? { path: findUser.image.path, filename: findUser.image.fileName }
      : null,
  });
}

const getUserById = (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized: Access denied. No token provided",
      });
    }
    res.json({
      userId: req.params.id,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Bad request: could not find user.",
      error: err.message,
    });
  }
};

const getSearchResults = (req, res) => {
  try {
    res.status(200).json({
      keyword: req.query.subject,
      time: req.query.time,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Bad request: could not fetch users.",
      error: err.message,
    });
  }
};

const uploadAvatar = async (req, res) => {
  const { originalname, filename, mimetype, size } = req.file;

  const { userId } = req;

  fileData = {
    originalname,
    filename,
    mimetype,
    size,
    path: filename,
    fieldname: "avatar",
  };
  const newfile = await fileService.upload(fileData);

  await userService.setImage(newfile._id, userId);

  res.status(200).json(newfile);
};

const getProducts = (req, res) => {
  try {
    res.json({
      products: ["Banana", "Watermelon", "Orange"],
    });
  } catch (err) {
    return res.status(400).json({
      message: "Bad request: could not fetch products.",
      error: err.message,
    });
  }
};

const getProductById = (req, res) => {
  try {
    res.json({
      product: req.params.id,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Bad request: could not fetch product by id.",
      error: err.message,
    });
  }
};

// Get all users
async function getAll(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { role, search, sort } = req.query;

    const findUsers = await userService.findAllUsers({
      page,
      limit,
      role,
      search,
      sort,
    });
    if (!findUsers) {
      return res.status(200).json({
        message: "No users in the database",
      });
    }
    res.status(200).json({
      findUsers: findUsers,
      message: "user found successfully",
    });
  } catch (err) {
    return res.status(400).json({
      message: "Bad request: could not fetch users.",
      error: err.message,
    });
  }
}

// find user with this
async function getDetail(req, res) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized: Access denied. No token provided",
      });
    }
    const { id } = req.params;
    const findUser = await userService.findUserById(id);

    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      findUser: findUser,
      message: "user found successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid User ID format or server error",
      error: error.message,
    });
  }
}

// change age with this
async function update(req, res) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized: Access denied. No token provided",
      });
    }
    const { id, age } = req.body;
    const findUser = await userService.findUserById(id);
    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    findUser.age = age;
    await findUser.save();
    res.status(200).json({
      findUser,
      message: "user data updated successfully",
    });
  } catch (err) {
    return res.status(400).json({
      message: "Bad request: could not update users.",
      error: err.message,
    });
  }
}

async function deleteOne(req, res) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized: Access denied. No token provided",
      });
    }
    const { id } = req.body;
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(204).json({
      message: "user deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      message: "Bad request: could not fetch users.",
      error: err.message,
    });
  }
}

module.exports = {
  register,
  login,
  getAll,
  getUserById,
  getSearchResults,
  getProducts,
  getProductById,
  getDetail,
  update,
  deleteOne,
  profile,
  uploadAvatar,
};
