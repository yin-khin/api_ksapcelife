const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    code: { type: DataTypes.STRING(50), primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    name_kh: { type: DataTypes.STRING(100), allowNull: false },
    icon: { type: DataTypes.STRING(50), allowNull: true },
    slug: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  },
  {
    tableName: "categories",
    timestamps: false,
  },
);

module.exports = Category;
