// routes/CommentRoute.js
const {
  getCommentsByPost,
  addComment,
  getAllComments,
  updateCommentStatus,
  deleteComment,
} = require("../controllers/CommentController");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

module.exports = (app) => {
  // Public Routes (No authentication required)
  app.get("/api/comments/:postId", getCommentsByPost);
  app.post("/api/comments", addComment);

  // Admin Routes (Authentication required)
  app.get("/api/admin/comments", authenticate, authorizeAdmin, getAllComments);
  app.put(
    "/api/admin/comments/:id/status",
    authenticate,
    authorizeAdmin,
    updateCommentStatus,
  );
  app.delete(
    "/api/admin/comments/:id",
    authenticate,
    authorizeAdmin,
    deleteComment,
  );
};
