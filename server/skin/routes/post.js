const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', upload.single('img'), (req, res) => {
  console.log(req.file);
  return res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', upload2.none(), async (req, res, next) => {
  try {
    console.log(req.user);
    const post = await Post.create({
      img: req.body.url,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
