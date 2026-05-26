// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");
// const bcrypt = require("bcryptjs");

// const User = sequelize.define(
//   "User",
//   {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
//     email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
//     password: { type: DataTypes.STRING(255), allowNull: false },
//     role: { type: DataTypes.ENUM("admin", "editor"), defaultValue: "admin" },
//     full_name: { type: DataTypes.STRING(100), allowNull: true },
//   },
//   {
//     tableName: "users",
//     timestamps: true,
//     hooks: {
//       beforeCreate: async (user) => {
//         if (user.password) {
//           const salt = await bcrypt.genSalt(10);
//           user.password = await bcrypt.hash(user.password, salt);
//         }
//       },
//       beforeUpdate: async (user) => {
//         if (user.changed("password")) {
//           const salt = await bcrypt.genSalt(10);
//           user.password = await bcrypt.hash(user.password, salt);
//         }
//       },
//     },
//   },
// );

// module.exports = User;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "admin" }, // SQLite doesn't support ENUM
    full_name: { type: DataTypes.STRING(100), allowNull: true },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

module.exports = User;
