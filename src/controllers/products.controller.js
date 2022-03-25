const Product = require('../models/product.model');

async function getAllProducts (req, res, next) {
  try {
    const products = await Product.findAll();
    res.render('customer/products/all-products',  { products });
  } catch (e) {
    next(e);
  }
}

async function getProductDetails (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render('customer/products/product-details', { product })
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails
}
