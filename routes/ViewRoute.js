// // routes/ViewRoute.js
// const {
//   trackView,
//   getDashboardStats,
// } = require("../controllers/ViewController");
// const { authenticate, authorizeAdmin } = require("../middleware/auth");

// module.exports = (app) => {
//   // Public route for tracking views (no authentication needed)
//   app.post("/api/track-view", trackView);

//   // Admin route for dashboard stats
//   app.get(
//     "/api/dashboard-stats",
//     authenticate,
//     authorizeAdmin,
//     getDashboardStats,
//   );
// };

const {
  trackView,
  getDashboardStats,
} = require("../controllers/ViewController");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

module.exports = (app) => {
  app.post("/api/track-view", trackView);
  app.get(
    "/api/dashboard-stats",
    authenticate,
    authorizeAdmin,
    getDashboardStats,
  );
};
