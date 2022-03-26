const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders (req, res, next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders,
    });
  } catch (e) {
    next(e);
  }
}

async function addOrder (req, res, next) {
  try {
    const userDocument = await User.findById(res.locals.uid);
    const cart = res.locals.cart;
    const order = new Order(cart, userDocument);
    await order.save();
  } catch (e) {
    return next(e);
  }

  req.session.cart = null;
  req.session.save();

  res.redirect('/orders');
}

module.exports = {
  getOrders: getOrders,
  addOrder: addOrder
};
