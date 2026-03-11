const express = require('express');
const router = express.Router();
const multer = require('multer');
const ocrController = require('../controllers/ocrControllers');

// Image kahan save hogi aur naam kya hoga
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

router.post('/extract', upload.single('image'), ocrController.extractText);

module.exports = router;
