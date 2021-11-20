const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);

    if (
      ext.includes(".jpg") ||
      ext.includes(".png") ||
      ext.includes(".jpeg") ||
      ext.includes(".heic")
    ) {
      cb(null, true);
    } else {
      cb(new Error("File type is not supported"), false);
    }

    return;
  },
  limits: { fileSize: 1024 * 1024 },
});
