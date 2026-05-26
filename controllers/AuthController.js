const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "សូមបញ្ចូល Email និង Password",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ឬ Password មិនត្រឹមត្រូវ",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ឬ Password មិនត្រឹមត្រូវ",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      message: "Login ជោគជ័យ",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const register = async (req, res) => {
  try {
    const { username, email, password, full_name, role } = req.body;
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });

    const existing = await User.findOne({ where: { username } });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });

    const user = await User.create({
      username,
      email,
      password,
      full_name,
      role: role || "editor",
    });

    res.status(201).json({
      success: true,
      message: "User created",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATED DEFAULT ADMIN ====================
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: { email: "kspacelite1999@gmail.com" },
    });

    if (!existingAdmin) {
      await User.create({
        username: "admin",
        email: "kspacelite1999@gmail.com",
        password: "@khin1999", // Will be automatically hashed
        full_name: "Super Administrator",
        role: "admin",
      });
      console.log("✅ Default Admin Created Successfully!");
      console.log("📧 Email    : kspacelite1999@gmail.com");
      console.log("🔑 Password : @khin1999");
    } else {
      console.log("✅ Default Admin already exists.");
    }
  } catch (e) {
    console.error("Default admin error:", e.message);
  }
};

module.exports = { login, register, createDefaultAdmin };
