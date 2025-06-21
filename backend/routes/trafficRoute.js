const express = require("express");
const router = express.Router();
const {
  getAllTrafficLights,
} = require("../controllers/trafficController");
const { createTrafficLight } = require("../controllers/createTrafficLight ");
const { register, login } = require("../controllers/authController");

const authMiddleware = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.post("/create", createTrafficLight);
router.get("/lights", getAllTrafficLights);
router.get("/admin-panel", authMiddleware, checkRole(["admin"]), (req, res) => {
  res.send("Admin only area 👑");
});
router.get("/profile", authMiddleware, (req, res) => {
  res.send(`Welcome ${req.user.role}`);
});

router.post("/register", register);
router.post("/login", login);




module.exports = router;
