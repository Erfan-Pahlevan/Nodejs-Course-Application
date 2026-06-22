const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

const assertValidPostId = (postId) => {
  if (!postId || !isValidObjectId(postId)) {
    const error = new Error("Invalid post ID format");
    error.statusCode = 400;
    throw error;
  }
};

module.exports = assertValidPostId;
