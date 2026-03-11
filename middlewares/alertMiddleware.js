import { Product } from "../models/Products.js";

const alertsMiddleware = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    const today = new Date();

    const alerts = products.filter(p => {
      const diff =
        (new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });

    res.locals.totalAlerts = alerts.length;
    next();
  } catch (err) {
    console.error(err);
    res.locals.totalAlerts = 0;
    next();
  }
};

export default alertsMiddleware;
