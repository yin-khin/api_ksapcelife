// models/Comment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Comment = sequelize.define(
  "Comment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    post_id: { type: DataTypes.INTEGER, allowNull: false },
    user_name: { type: DataTypes.STRING(100), allowNull: false },
    user_email: { type: DataTypes.STRING(100), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("approved", "pending", "spam"),
      defaultValue: "pending",
    },
    parent_id: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "comments",
    timestamps: true,
  },
);

module.exports = Comment;
