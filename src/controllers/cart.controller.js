const Product = require('../models/product.model');

async function addCartItem (req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (e) {
    return next(e);
  }

  const cart = res.locals.cart;
  cart.addItem(product);
  req.session.cart = cart;
  req.session.save();

  res.status(201).json({ message: 'Cart Updated', newTotalItems: cart.totalQuantity });
}

module.exports = {
  addCartItem: addCartItem
}
