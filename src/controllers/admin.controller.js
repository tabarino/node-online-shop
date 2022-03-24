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

async function getUpdateProduct (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/products/update-product', { product })
  } catch (e) {
    next(e);
  }
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

async function updateProduct (req, res, next) {
  const product = new Product({ ...req.body, _id: req.params.id });

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (e) {
    next(e);
    return;
  }

  res.redirect('/admin/products');
}

async function deleteProduct (req, res, next) {
  let product
  try {
    product = await Product.findById(req.params.id);
    await product.remove()
  } catch (e) {
    return next(e);
  }
  res.json({ message: 'Deleted Product' });
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  getUpdateProduct: getUpdateProduct,
  createNewProduct: createNewProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct
};
