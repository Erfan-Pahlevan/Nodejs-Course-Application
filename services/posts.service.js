// const post = async (title, content) => {
//   return postModel.create({ title, content });
// };

const postModel = require("../models/posts.model");

const create = async (data, userId) => {
  const newPost = await postModel.create({
    title: data.title,
    content: data.content,
    user: userId,
  });

  return newPost;
};

const deletePost = async (data) => {
  return postModel.findByIdAndDelete(data);
};

const findPost = async (data) => {
  return postModel.findById(data).populate([
    {
      path: "user",
      // select: "+password"
    },
  ]);
};

const findAllPosts = async ({ page, limit, search, sort }) => {
  const filter = {};

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  const options = {
    page,
    limit,
    sort: sort || undefined,
    populate: {
      path: "user",
    },
  };

  return postModel.paginate(filter, options);
};

module.exports = { create, deletePost, findPost, findAllPosts };
