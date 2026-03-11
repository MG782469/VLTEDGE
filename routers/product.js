import { Router } from 'express';
import multer, { diskStorage } from 'multer';
const router = Router();
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getExpiringSoon } from '../controllers/product';
const fakeAuth = (req, res, next) => {
  req.user = { id: "12345" };
  next();
};
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
router.use(fakeAuth);
router.post('/products',upload.single('image'), createProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products-expiring-soon', getExpiringSoon);

export default router;
