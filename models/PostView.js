// models/PostView.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PostView = sequelize.define(
  "PostView",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    post_id: { type: DataTypes.INTEGER, allowNull: false },
    ip_address: { type: DataTypes.STRING(45), allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },
    viewed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "post_views",
    timestamps: false,
  },
);

module.exports = PostView;
