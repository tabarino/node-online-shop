const stripe = require('stripe')('sk_test_...');

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

function getSuccess (req, res) {
  res.render('customer/orders/success');
}

function getCancel (req, res) {
  res.render('customer/orders/cancel');
}

async function addOrder (req, res, next) {
  let stripeSession;
  try {
    const cart = res.locals.cart;
    const userDocument = await User.findById(res.locals.uid);
    const order = new Order(cart, userDocument);
    await order.save();

    stripeSession = await stripe.checkout.sessions.create({
      line_items: cart.items.map(item => ({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: +item.product.price.toFixed(2) * 100,
          product_data: {
            name: item.product.title
          }
        }
      })),
      mode: 'payment',
      success_url: `http://localhost:3000/orders/success`,
      cancel_url: `http://localhost:3000/orders/cancel`
    });

  } catch (e) {
    return next(e);
  }

  req.session.cart = null;
  req.session.save();

  res.redirect(303, stripeSession.url);
}

module.exports = {
  getOrders: getOrders,
  getSuccess: getSuccess,
  getCancel: getCancel,
  addOrder: addOrder
};
