require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const AuthRoute = require("./routes/AuthRoute");
const PostRoute = require("./routes/PostRoute");
const { createDefaultAdmin } = require("./controllers/AuthController");
const ViewRoute = require("./routes/ViewRoute");
const PublicRoute = require("./routes/PublicRoute");
const CommentRoute = require("./routes/CommentRoute"); // ← បន្ថែមនេះ

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static("uploads"));

// Routes
AuthRoute(app);
PostRoute(app);
ViewRoute(app);
PublicRoute(app);
CommentRoute(app); // ← បន្ថែមនេះ
app.get("/", (req, res) =>
  res.json({ message: "🚀 CamBo Space Backend Running" }),
);

const PORT = process.env.PORT || 5000;

// ✅ Better: Use different sync options based on environment
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
  try {
    if (isProduction) {
      // Production: Don't alter tables automatically
      await sequelize.sync({ alter: false });
      console.log("✅ Database synced (production - no changes)");
    } else if (isDevelopment) {
      // Development: Allow altering tables but preserve data
      await sequelize.sync({ alter: true });
      console.log("✅ Database synced (development - alter allowed)");
    } else {
      // Default: Safe option
      await sequelize.sync({ alter: true });
      console.log("✅ Database synced (data preserved)");
    }

    await createDefaultAdmin();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("❌ DB Error:", err);
    process.exit(1);
  }
}

startServer();

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { sequelize } = require("./models");

// const AuthRoute = require("./routes/AuthRoute");
// const PostRoute = require("./routes/PostRoute");
// const ViewRoute = require("./routes/ViewRoute");
// const PublicRoute = require("./routes/PublicRoute");
// const { createDefaultAdmin } = require("./controllers/AuthController");

// const app = express();

// /* =========================
//    MIDDLEWARE
// ========================= */
// app.use(cors());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use("/uploads", express.static("uploads"));

// /* =========================
//    ROUTES
// ========================= */
// AuthRoute(app);
// PostRoute(app);
// ViewRoute(app);
// PublicRoute(app);

// /* =========================
//    HOME ROUTE
// ========================= */
// app.get("/", (req, res) => {
//   res.json({ message: "🚀 CamBo Space Backend Running" });
// });

// /* =========================
//    HEALTH CHECK (OPTIONAL)
// ========================= */
// app.get("/health", (req, res) => {
//   res.json({
//     status: "ok",
//     env: process.env.NODE_ENV,
//     uptime: process.uptime(),
//   });
// });

// /* =========================
//    SERVER CONFIG
// ========================= */
// const PORT = process.env.PORT || 3000;
// const isProduction = process.env.NODE_ENV === "production";
// const isDevelopment = process.env.NODE_ENV === "development";

// /* =========================
//    START SERVER
// ========================= */
// async function startServer() {
//   try {
//     // Database sync strategy
//     if (isProduction) {
//       await sequelize.sync({ alter: false });
//       console.log("✅ Database synced (production - safe mode)");
//     } else if (isDevelopment) {
//       await sequelize.sync({ alter: true });
//       console.log("✅ Database synced (development - alter enabled)");
//     } else {
//       await sequelize.sync();
//       console.log("✅ Database synced (default mode)");
//     }

//     // Create default admin
//     await createDefaultAdmin();

//     // Start server (IMPORTANT for Railway/Render)
//     app.listen(PORT, "0.0.0.0", () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
//     });
//   } catch (err) {
//     console.error("❌ Server Error:", err);
//     process.exit(1);
//   }
// }

// startServer();
