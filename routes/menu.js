const express = require("express"),
  router = express.Router();
const Menu = require("../models/menu");
const cloudinary = require("../utils/cloudinary"),
  upload = require("../utils/multer"),
  auth = require("../middleware/auth");

// get all food menu
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// create food menu
router.post("/", auth, upload.single("image"), async (req, res) => {
  let imageFiles = req.file;
  if (!imageFiles) {
    return res.status(400).json({ message: "No Image attached" });
  }
  try {
    const imgResult = await cloudinary.uploader.upload(req.file.path);

    const post = new Menu({
      name: req.body.name,
      description: req.body.desc,
      img: imgResult.secure_url,
      category: req.body.category,
    });
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a food menu
router.get("/:id", getAMenu, (req, res) => {
  res.json(res.data);
});

// update a food menu
router.patch(
  "/:id",
  getAMenu,
  auth,
  upload.single("image"),
  async (req, res) => {
    if (req.body.name != null) {
      res.data.name = req.body.name;
    }
    if (req.body.desc != null) {
      res.data.description = req.body.desc;
    }
    let imageFiles = req.file;
    if (!imageFiles) {
      return res.status(400).json({ message: "No Image attached" });
    } else {
      const imgResult = await cloudinary.uploader.upload(req.file.path);
      res.data.img = imgResult.secure_url;
    }
    try {
      const updatedPost = await res.data.save();
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// delete a menu
router.delete("/:id", getAMenu, auth, async (req, res) => {
  try {
    await res.data.remove();
    res.status(200).json({ message: "Menu successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a menu by ID middleware
async function getAMenu(req, res, next) {
  let data;
  try {
    data = await Menu.findById(req.params.id);
    if (data == null) {
      return res.status(404).json({ message: "Cannot Find menu" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.data = data;
  next();
}
module.exports = router;
