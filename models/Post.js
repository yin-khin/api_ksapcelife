

// models/Post.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Post = sequelize.define(
  "Post",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    title_kh: { type: DataTypes.STRING(255), allowNull: false },
    content: { type: DataTypes.TEXT("long"), allowNull: true },
    images: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      get() {
        const val = this.getDataValue("images");
        return val ? JSON.parse(val) : [];
      },
      set(value) {
        this.setDataValue("images", JSON.stringify(value));
      },
    },
    image_descriptions: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      get() {
        const val = this.getDataValue("image_descriptions");
        return val ? JSON.parse(val) : [];
      },
      set(value) {
        this.setDataValue("image_descriptions", JSON.stringify(value));
      },
    },
    category_code: { type: DataTypes.STRING(50), allowNull: false },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "posts",
    timestamps: true,
  },
);

// កុំដាក់ association នៅទីនេះ

module.exports = Post;
