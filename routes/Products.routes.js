import { Router } from "express";
import multer, { diskStorage } from 'multer';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getExpiringSoon
} from "../controllers/Products.controller.js";
import { VerifyJwt } from "../auth.js";
const router = Router()
// routes/Products.routes.js mein
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });
router.route('/products').post(VerifyJwt,upload.single('image'), createProduct);
router.route("/getproducts").get(VerifyJwt, getProducts);
router.route("/expiring-soon").get(VerifyJwt, getExpiringSoon)
router.route("/modify/:id").get(VerifyJwt, getProductById).patch(VerifyJwt, updateProduct).delete(VerifyJwt, deleteProduct)    
export default router
