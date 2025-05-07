const express = require("express");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });
const controller = require("../controllers/controller");
const router = express.Router();

router.post("/upload", upload.single("file"), controller.submitAddRecipe);
router.put("/savechanges/:id", upload.single("image"), controller.saveChanges);

module.exports = router;
