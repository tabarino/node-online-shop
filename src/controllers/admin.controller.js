const Product = require('../models/product.model');

async function getProducts (req, res, next) {
  try {
    const products = await Product.findAll();
    res.render('admin/products/all-products', { products });
  } catch (e) {
    next(e);
  }
}

function getNewProduct (req, res) {
  res.render('admin/products/new-product');
}

async function createNewProduct (req, res, next) {
  const product = new Product({ ...req.body, image: req.file.filename });

  try {
    await product.save();
  } catch (e) {
    next(e);
    return
  }

  res.redirect('/admin/products');
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct
};
