// // models/index.js
// const sequelize = require("../config/db");
// const Post = require("./Post");
// const Category = require("./Category");
// const PostView = require("./PostView");

// // Define all associations HERE only
// Post.belongsTo(Category, {
//   foreignKey: "category_code",
//   targetKey: "code",
//   as: "category",
// });

// Category.hasMany(Post, {
//   foreignKey: "category_code",
//   sourceKey: "code",
//   as: "posts",
// });

// Post.hasMany(PostView, {
//   foreignKey: "post_id",
//   as: "viewRecords",
//   onDelete: "CASCADE",
// });

// PostView.belongsTo(Post, {
//   foreignKey: "post_id",
//   as: "post",
// });

// module.exports = {
//   sequelize,
//   Post,
//   Category,
//   PostView,
// };

// models/index.js
const sequelize = require("../config/db");
const User = require("./User");
const Category = require("./Category");
const Post = require("./Post");
const PostView = require("./PostView");
const Comment = require("./Comment");

// Associations
Post.belongsTo(Category, {
  foreignKey: "category_code",
  targetKey: "code",
  as: "category",
});

Category.hasMany(Post, {
  foreignKey: "category_code",
  sourceKey: "code",
  as: "posts",
});

Post.hasMany(PostView, {
  foreignKey: "post_id",
  as: "viewRecords",
  onDelete: "CASCADE",
});

PostView.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
  as: "comments",
  onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post",
});

module.exports = {
  sequelize,
  User,
  Category,
  Post,
  PostView,
  Comment,
};