import {Product} from "../models/Products.js"

export const createProduct = async (req, res) => {
  try {
    const { name, category, purchaseDate, expiryDate } = req.body;
    if (!name || !expiryDate) {
      return res.status(400).json({ error: "Name & Expiry Date required" });
    }
    const newProduct = new Product({
      userId:"bgiftyicytdityrity",
      name,
      category,
      purchaseDate,
      expiryDate,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product create failed" });
  }
};

export const getMyProductsPage = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.render("my-products", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting product' });
  }
};

export const getExpiringSoon = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    const products = await Product.find({
      userId: req.user.id,
      expiryDate: { 
        $gte: today, 
        $lte: futureDate 
      }
    }).sort({ expiryDate: 1 });
    res.json({
      count: products.length,
      range: `Next ${days} days`,
      products
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching expiring products' });
  }
};
