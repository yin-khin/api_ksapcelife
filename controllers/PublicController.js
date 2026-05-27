// // controllers/PublicController.js
// const { Post, Category } = require("../models");
// const { Op } = require("sequelize");

// const getPublicPosts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 9;
//     const offset = (page - 1) * limit;
//     const category = req.query.category; // យក category parameter

//     console.log("📌 Category filter received:", category);

//     // បង្កើត where condition
//     let whereCondition = {};

//     // ប្រសិនបើមាន category សូមត្រង
//     if (
//       category &&
//       category !== "undefined" &&
//       category !== "null" &&
//       category !== ""
//     ) {
//       whereCondition.category_code = category;
//       console.log(`🔍 Filtering by category_code: ${category}`);
//     } else {
//       console.log("📋 Showing all posts");
//     }

//     const { count, rows } = await Post.findAndCountAll({
//       where: whereCondition,
//       include: [{ model: Category, as: "category" }],
//       order: [["createdAt", "DESC"]],
//       limit,
//       offset,
//     });

//     console.log(`📊 Found ${count} posts`);

//     res.json({
//       success: true,
//       posts: rows,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       totalPosts: count,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getPublicPostById = async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id, {
//       include: [{ model: Category, as: "category" }],
//     });

//     if (!post) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Post not found" });
//     }

//     res.json({ success: true, post });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getPublicCategories = async (req, res) => {
//   try {
//     const categories = await Category.findAll();
//     res.json({ success: true, categories });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getRecentPosts = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 5;
//     const posts = await Post.findAll({
//       include: [{ model: Category, as: "category" }],
//       order: [["createdAt", "DESC"]],
//       limit,
//     });
//     res.json({ success: true, posts });
//   } catch (error) {
//     console.error("Error in getRecentPosts:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getPopularPosts = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 5;
//     const posts = await Post.findAll({
//       include: [{ model: Category, as: "category" }],
//       order: [["views", "DESC"]],
//       limit,
//     });
//     res.json({ success: true, posts });
//   } catch (error) {
//     console.error("Error in getPopularPosts:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const searchPosts = async (req, res) => {
//   try {
//     const query = req.query.q;
//     if (!query) {
//       return res.json({ success: true, posts: [] });
//     }

//     const posts = await Post.findAll({
//       where: {
//         [Op.or]: [
//           { title: { [Op.like]: `%${query}%` } },
//           { title_kh: { [Op.like]: `%${query}%` } },
//           { content: { [Op.like]: `%${query}%` } },
//         ],
//       },
//       include: [{ model: Category, as: "category" }],
//       order: [["createdAt", "DESC"]],
//     });

//     res.json({ success: true, posts });
//   } catch (error) {
//     console.error("Error in searchPosts:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   getPublicPosts,
//   getPublicPostById,
//   getPublicCategories,
//   getRecentPosts,
//   getPopularPosts,
//   searchPosts,
// };
// controllers/PublicController.js
const { Post, Category } = require("../models");
const { Op } = require("sequelize");

const getPublicPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const category = req.query.category;

    console.log("📌 Public Posts Request - Category:", category);

    // Build where condition
    let whereCondition = {};

    // Filter by category if provided
    if (
      category &&
      category !== "undefined" &&
      category !== "null" &&
      category !== ""
    ) {
      whereCondition.category_code = category;
      console.log(`🔍 Filtering by category: ${category}`);
    }

    const { count, rows } = await Post.findAndCountAll({
      where: whereCondition,
      include: [{ model: Category, as: "category" }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    console.log(`📊 Found ${count} posts`);

    res.json({
      success: true,
      posts: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPosts: count,
    });
  } catch (error) {
    console.error("Error in getPublicPosts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Category, as: "category" }],
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error("Error in getPublicPostById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name_kh", "ASC"]],
    });
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error in getPublicCategories:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecentPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const posts = await Post.findAll({
      include: [{ model: Category, as: "category" }],
      order: [["createdAt", "DESC"]],
      limit,
    });
    res.json({ success: true, posts });
  } catch (error) {
    console.error("Error in getRecentPosts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPopularPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const posts = await Post.findAll({
      include: [{ model: Category, as: "category" }],
      order: [["views", "DESC"]],
      limit,
    });
    res.json({ success: true, posts });
  } catch (error) {
    console.error("Error in getPopularPosts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchPosts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === "") {
      return res.json({ success: true, posts: [], totalPages: 0 });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { title_kh: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{ model: Category, as: "category" }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      success: true,
      posts: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPosts: count,
    });
  } catch (error) {
    console.error("Error in searchPosts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublicPosts,
  getPublicPostById,
  getPublicCategories,
  getRecentPosts,
  getPopularPosts,
  searchPosts,
};
