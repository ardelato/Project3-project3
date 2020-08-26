const router = require("express").Router();
const userRoutes = require("./users.js");
const toyRoutes = require("./toys.js");
const toySearchRoutes = require("./searchfunction");

// API Routes
router.use(userRoutes);
router.use(toyRoutes);
router.use(toySearchRoutes);

module.exports = router;
