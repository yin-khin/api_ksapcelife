// const {
//   getAllPosts,
//   getPostById,
//   getCategories,
//   createPost,
//   updatePost,
//   deletePost,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// } = require("../controllers/PostController");

// const { authenticate, authorizeAdmin } = require("../middleware/auth");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/posts";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });

// const upload = multer({ storage });

// module.exports = (app) => {
//   // Public Routes
//   app.get("/api/categories", getCategories);
//   app.get("/api/posts", getAllPosts);
//   app.get("/api/posts/:id", getPostById);

//   // Protected Routes with multer
//   app.post(
//     "/api/posts",
//     authenticate,
//     authorizeAdmin,
//     upload.array("images", 10),
//     createPost,
//   );
//   app.put(
//     "/api/posts/:id",
//     authenticate,
//     authorizeAdmin,
//     upload.array("images", 10),
//     updatePost,
//   );
//   app.delete("/api/posts/:id", authenticate, authorizeAdmin, deletePost);

//   // Category Routes
//   app.post("/api/categories", authenticate, authorizeAdmin, createCategory);
//   app.put(
//     "/api/categories/:code",
//     authenticate,
//     authorizeAdmin,
//     updateCategory,
//   );
//   app.delete(
//     "/api/categories/:code",
//     authenticate,
//     authorizeAdmin,
//     deleteCategory,
//   );
// };

const {
  getAllPosts,
  getPostById,
  getCategories,
  createPost,
  updatePost,
  deletePost,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/PostController");

const { authenticate, authorizeAdmin } = require("../middleware/auth");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads/posts
const uploadPath = path.join(__dirname, "..", "uploads", "posts");

// create folder automatically
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

module.exports = (app) => {
  // PUBLIC
  app.get("/api/categories", getCategories);
  app.get("/api/posts", getAllPosts);
  app.get("/api/posts/:id", getPostById);

  // POSTS
  app.post(
    "/api/posts",
    authenticate,
    authorizeAdmin,
    upload.array("images", 10),
    createPost,
  );

  app.put(
    "/api/posts/:id",
    authenticate,
    authorizeAdmin,
    upload.array("images", 10),
    updatePost,
  );

  app.delete("/api/posts/:id", authenticate, authorizeAdmin, deletePost);

  // CATEGORY
  app.post("/api/categories", authenticate, authorizeAdmin, createCategory);

  app.put(
    "/api/categories/:code",
    authenticate,
    authorizeAdmin,
    updateCategory,
  );

  app.delete(
    "/api/categories/:code",
    authenticate,
    authorizeAdmin,
    deleteCategory,
  );
};
