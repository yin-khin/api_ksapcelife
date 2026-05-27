// controllers/CommentController.js
const { Comment, Post } = require("../models");

// Public - Get comments for a post
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      where: { post_id: postId, status: "approved" },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public - Add a new comment
const addComment = async (req, res) => {
  try {
    const { post_id, user_name, user_email, content, parent_id } = req.body;

    // Check if post exists
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const comment = await Comment.create({
      post_id,
      user_name: user_name || "Anonymous",
      user_email: user_email || null,
      content,
      parent_id: parent_id || 0,
      status: "pending",
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin - Get all comments
const getAllComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    const where = {};
    if (status && status !== "all") where.status = status;

    const { count, rows } = await Comment.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      success: true,
      comments: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalComments: count,
    });
  } catch (error) {
    console.error("Error fetching all comments:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin - Update comment status
const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    await comment.update({ status });
    res.json({ success: true, comment });
  } catch (error) {
    console.error("Error updating comment status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin - Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    await comment.destroy();
    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCommentsByPost,
  addComment,
  getAllComments,
  updateCommentStatus,
  deleteComment,
};
