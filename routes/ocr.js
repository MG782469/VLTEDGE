import { Router } from 'express';
const router = Router();
import multer, { diskStorage } from 'multer';
import { extractText } from '../controllers/ocrControllers.js';

// Image kahan save hogi aur naam kya hoga
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

router.post('/extract', upload.single('image'), extractText);

export default router;
