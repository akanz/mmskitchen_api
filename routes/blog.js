const express = require("express"),
  router = express.Router();

const Blogpost = require("../models/blog");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer"),
  auth = require("../middleware/auth");

// get all blog posts
router.get("/", async (req, res) => {
  try {
    const post = await Blogpost.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// create blog post
router.post("/", auth, upload.single("image"), async (req, res) => {
  let imageFiles = req.file;
  if (!imageFiles) {
    return res.status(400).json({ message: "No Image attached" });
  }

  try {
    const imgResult = await cloudinary.uploader.upload(req.file.path);
    const post = new Blogpost({
      title: req.body.title,
      body: req.body.body,
      img: imgResult.secure_url,
    });
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a blog post
router.get("/:id", getApost, (req, res) => {
  res.status(200).json(res.post);
});

// update a blog post
router.patch(
  "/:id",
  getApost,
  auth,
  upload.single("image"),
  async (req, res) => {
    if (req.body.title != null) {
      res.post.title = req.body.title;
    }
    if (req.body.body != null) {
      res.post.body = req.body.body;
    }
    if (!imageFiles) {
      return res.status(400).json({ message: "No Image attached" });
    } else {
      const imgResult = await cloudinary.uploader.upload(req.file.path);
      res.post.img = imgResult.secure_url;
    }
    try {
      const updatedPost = await res.post.save();
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// delete a blog post
router.delete("/:id", getApost, auth, async (req, res) => {
  try {
    await res.post.remove();
    res.status(200).json({ message: "Post successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getApost(req, res, next) {
  let post;
  try {
    post = await Blogpost.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: "Cannot Find post" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.post = post;
  next();
}
module.exports = router;
