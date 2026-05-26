// // controllers/ViewController.js
// const { sequelize, Post, PostView, Category } = require("../models");
// const { Op } = require("sequelize");

// const trackView = async (req, res) => {
//   try {
//     const { post_id } = req.body;
//     const ip_address = req.ip || req.connection.remoteAddress;
//     const user_agent = req.headers["user-agent"];

//     // Check if same IP viewed in last 1 hour (optional)
//     const oneHourAgo = new Date();
//     oneHourAgo.setHours(oneHourAgo.getHours() - 1);

//     const existingView = await PostView.findOne({
//       where: {
//         post_id,
//         ip_address,
//         viewed_at: {
//           [Op.gte]: oneHourAgo,
//         },
//       },
//     });

//     if (!existingView) {
//       await PostView.create({
//         post_id,
//         ip_address,
//         user_agent,
//         viewed_at: new Date(),
//       });

//       // Update post views count
//       await Post.increment("views", { where: { id: post_id } });
//     }

//     res.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getDashboardStats = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     // Get today's views
//     const todayViews = await PostView.count({
//       where: {
//         viewed_at: {
//           [Op.gte]: today,
//           [Op.lt]: tomorrow,
//         },
//       },
//     });

//     // Get total posts
//     const totalPosts = await Post.count();

//     // Get total categories
//     const totalCategories = await Category.count();

//     // Get last 7 days views for chart
//     const last7Days = [];
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       date.setHours(0, 0, 0, 0);

//       const nextDate = new Date(date);
//       nextDate.setDate(nextDate.getDate() + 1);

//       const count = await PostView.count({
//         where: {
//           viewed_at: {
//             [Op.gte]: date,
//             [Op.lt]: nextDate,
//           },
//         },
//       });

//       last7Days.push({
//         date: date.toLocaleDateString("en-US", { weekday: "short" }),
//         views: count,
//       });
//     }

//     // Get most viewed posts
//     const mostViewedPosts = await Post.findAll({
//       order: [["views", "DESC"]],
//       limit: 5,
//       include: [{ model: Category, as: "category" }],
//     });

//     res.json({
//       success: true,
//       stats: {
//         todayViews,
//         totalPosts,
//         totalCategories,
//         weeklyViews: last7Days,
//         mostViewedPosts,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { trackView, getDashboardStats };

const { Post, PostView, Category } = require("../models");
const { Op } = require("sequelize");

const trackView = async (req, res) => {
  try {
    const { post_id } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers["user-agent"];

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const existingView = await PostView.findOne({
      where: {
        post_id,
        ip_address,
        viewed_at: { [Op.gte]: oneHourAgo },
      },
    });

    if (!existingView) {
      await PostView.create({
        post_id,
        ip_address,
        user_agent,
        viewed_at: new Date(),
      });
      await Post.increment("views", { where: { id: post_id } });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayViews = await PostView.count({
      where: { viewed_at: { [Op.gte]: today, [Op.lt]: tomorrow } },
    });

    const totalPosts = await Post.count();
    const totalCategories = await Category.count();

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const count = await PostView.count({
        where: { viewed_at: { [Op.gte]: date, [Op.lt]: nextDate } },
      });
      last7Days.push({
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        views: count,
      });
    }

    const mostViewedPosts = await Post.findAll({
      order: [["views", "DESC"]],
      limit: 5,
      include: [{ model: Category, as: "category" }],
    });

    res.json({
      success: true,
      stats: {
        todayViews,
        totalPosts,
        totalCategories,
        weeklyViews: last7Days,
        mostViewedPosts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { trackView, getDashboardStats };
