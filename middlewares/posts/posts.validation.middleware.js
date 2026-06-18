const mongoose = require("mongoose");

function validateCreatePost(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "request body is required",
      });
    }
  
    const { title, content } = req.body;
  
    if (!title) {
      return res.status(400).json({
        status: 400,
        message: "title is required",
      });
    }
  
    if (typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        status: 400,
        message: "title must be at least 3 characters",
      });
    }
  
    if (content && typeof content !== "string") {
      return res.status(400).json({
        status: 400,
        message: "content must be a string",
      });
    }
  
    next();
  }
  
  function validateDeletePost(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "request body is required",
      });
    }
  
    const { postId } = req.body;
  
    if (!postId) {
      return res.status(400).json({
        status: 400,
        message: "postId is required",
      });
    }
  
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        status: 400,
        message: "postId is invalid",
      });
    }
  
    next();
  }

  module.exports = {
    validateCreatePost,
    validateDeletePost
  };