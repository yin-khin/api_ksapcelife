// // const {
// //   getPublicPosts,
// //   getPublicPostById,
// //   getPublicCategories,
// //   getRecentPosts,
// //   getPopularPosts,
// //   // searchPosts,  // ← បិទនេះជាបណ្តោះអាសន្ន
// // } = require("../controllers/PublicController");

// // module.exports = (app) => {
// //   // Posts
// //   app.get("/api/posts", getPublicPosts);
// //   app.get("/api/posts/recent", getRecentPosts);
// //   app.get("/api/posts/popular", getPopularPosts);
// //   app.get("/api/posts/:id", getPublicPostById);

// //   // Categories
// //   app.get("/api/categories", getPublicCategories);

// //   // Search - បិទនេះជាបណ្តោះអាសន្ន
// //   // app.get("/api/search", searchPosts);
// // };

// // routes/PublicRoute.js
// const {
//   getPublicPosts,
//   getPublicPostById,
//   getPublicCategories,
//   getRecentPosts,
//   getPopularPosts,
// } = require("../controllers/PublicController");

// module.exports = (app) => {
//   // Posts
//   app.get("/api/posts", getPublicPosts);
//   app.get("/api/posts/recent", getRecentPosts); // ← បន្ថែមនេះ
//   app.get("/api/posts/popular", getPopularPosts); // ← បន្ថែមនេះ
//   app.get("/api/posts/:id", getPublicPostById);

//   // Categories
//   app.get("/api/categories", getPublicCategories);
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
  // Posts
  app.get("/api/posts", getPublicPosts);
  app.get("/api/posts/recent", getRecentPosts);
  app.get("/api/posts/popular", getPopularPosts);
  app.get("/api/posts/:id", getPublicPostById);

  // Categories
  app.get("/api/categories", getPublicCategories);

  // Search
  app.get("/api/search", searchPosts);
};
