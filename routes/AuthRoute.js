const { login, register } = require("../controllers/AuthController");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

module.exports = (app) => {
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", authenticate, authorizeAdmin, register);
};
