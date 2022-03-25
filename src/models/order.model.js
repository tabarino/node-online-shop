const db = require('../data/database');

class Order {
  // status = pending / fulfilled / cancelled
  constructor (cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date();
    if (date) {
      this.date = new Date(date);
      this.formattedDate = this.date.toLocaleDateString('en-UK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    this.id = orderId;
  }

  async save () {
    if (this.id) {
      // Update
    } else {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        status: this.status,
        date: new Date()
      }
      await db.getDbConn().collection('orders').insertOne(orderDocument);
    }
  }
}

module.exports = Order;
