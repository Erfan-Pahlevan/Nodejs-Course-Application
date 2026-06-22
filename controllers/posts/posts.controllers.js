const postService = require("../../services/posts.service");
const assertValidPostId = require("../../validators/posts.validators");

const createPost = async (req, res) => {
  const { userId } = req;
  const data = req.body;
  const newPost = await postService.create(data, userId);

  return res.status(201).json({
    data: newPost,
    message: "Post created successfully",
  });
};

const getPost = async (req, res) => {
  const { postId } = req.params;

  assertValidPostId(postId);

  const findPost = await postService.findPost(postId);

  if (!findPost) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.status(200).json({
    findPost: findPost,
    message: "Post found successfully",
  });
};

const deletePost = async (req, res) => {
  const { postId } = req.params;

  assertValidPostId(postId);

  const findPost = await postService.findPost(postId);
  if (!findPost) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  await postService.deletePost(postId);

  return res.status(204).json({
    findPost: findPost,
    message: "Post deleted successfully",
  });
};

const getAllPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { search, sort } = req.query;

  const findPosts = await postService.findAllPosts({
    page,
    limit,
    search,
    sort,
  });

  if (!findPosts) {
    return res.status(200).json({
      message: "No posts in the database",
    });
  }

  return res.status(200).json({
    findPosts,
    message: "Posts found successfully",
  });
};

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  deletePost,
};
