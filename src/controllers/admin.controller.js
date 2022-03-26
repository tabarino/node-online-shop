const Product = require('../models/product.model');
const Order = require('../models/order.model');

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
    return next(e);
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
    return next(e);
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

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render('admin/orders/admin-orders', {
      orders: orders
    });
  } catch (e) {
    next(e);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);
    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  getUpdateProduct: getUpdateProduct,
  createNewProduct: createNewProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
};
