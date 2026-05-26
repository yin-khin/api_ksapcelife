// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { sequelize } = require("./models"); // Import from models/index.js

// const AuthRoute = require("./routes/AuthRoute");
// const PostRoute = require("./routes/PostRoute");
// const { createDefaultAdmin } = require("./controllers/AuthController");
// const ViewRoute = require("./routes/ViewRoute");
// const PublicRoute = require("./routes/PublicRoute");

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use("/uploads", express.static("uploads"));

// // Routes
// AuthRoute(app);
// PostRoute(app);
// ViewRoute(app);
// PublicRoute(app);

// app.get("/", (req, res) =>
//   res.json({ message: "🚀 CamBo Space Backend Running" }),
// );

// const PORT = process.env.PORT || 3000;

// sequelize
//   .sync({ alter: true }) // ← ប្រើ force: true ម្តង
//   .then(async () => {
//     console.log("✅ Database synced");
//     await createDefaultAdmin();
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ DB Error:", err);
//     process.exit(1);
//   });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const AuthRoute = require("./routes/AuthRoute");
const PostRoute = require("./routes/PostRoute");
const { createDefaultAdmin } = require("./controllers/AuthController");
const ViewRoute = require("./routes/ViewRoute");
const PublicRoute = require("./routes/PublicRoute");

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

app.get("/", (req, res) =>
  res.json({ message: "🚀 CamBo Space Backend Running" }),
);

const PORT = process.env.PORT || 3000;

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
