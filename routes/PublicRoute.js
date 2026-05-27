// const {
//   getPublicPosts,
//   getPublicPostById,
//   getPublicCategories,
//   getRecentPosts,
//   getPopularPosts,
//   searchPosts,
// } = require("../controllers/PublicController");

// module.exports = (app) => {
//   // Posts
//   app.get("/api/posts", getPublicPosts);
//   app.get("/api/posts/recent", getRecentPosts);
//   app.get("/api/posts/popular", getPopularPosts);
//   app.get("/api/posts/:id", getPublicPostById);

//   // Categories
//   app.get("/api/categories", getPublicCategories);

//   // Search
//   app.get("/api/search", searchPosts);
// };
// routes/PublicRoute.js
const {
  getPublicPosts,
  getPublicPostById,
  getPublicCategories,
  getRecentPosts,
  getPopularPosts,
  searchPosts,
} = require("../controllers/PublicController");

module.exports = (app) => {
  // ✅ Public Posts Routes
  app.get("/api/public/posts", getPublicPosts);
  app.get("/api/public/posts/recent", getRecentPosts);
  app.get("/api/public/posts/popular", getPopularPosts);
  app.get("/api/public/posts/:id", getPublicPostById);

  // ✅ Public Categories Routes
  app.get("/api/public/categories", getPublicCategories);

  // ✅ Public Search Route
  app.get("/api/public/search", searchPosts);
};
