const Order = require('../models/order.model');
const User = require('../models/user.model');

function getOrders (req, res) {
  res.render('customer/orders/all-orders');
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
