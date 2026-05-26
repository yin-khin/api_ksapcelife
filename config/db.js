// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME || "kspace_life_db",
//   process.env.DB_USER || "root",
//   process.env.DB_PASSWORD || "",
//   {
//     host: process.env.DB_HOST || "localhost",
//     port: Number(process.env.DB_PORT || 3306),
//     dialect: "mysql",
//     logging: false,

//     // 🔥 សំខាន់សម្រាប់ WAMP Local
//     dialectOptions: {
//       ssl: false,
//     },
//   },
// );

// module.exports = sequelize;

const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL, {
  dialect: "mysql",
  logging: false,

  dialectOptions: {
    ssl: false,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Railway MySQL Connected");
  })
  .catch((err) => {
    console.log("❌ Database Error:", err);
  });

module.exports = sequelize;
