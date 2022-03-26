const mongodb = require('mongodb');

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

  static transformOrderDocument (orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments (orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll () {
    const orders = await db.getDbConn().collection('orders').find().sort({ _id: -1 }).toArray();
    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser (userId) {
    const uid = new mongodb.ObjectId(userId);
    const orders = await db.getDbConn().collection('orders').find({ 'userData._id': uid }).sort({ _id: -1 }).toArray();
    return this.transformOrderDocuments(orders);
  }

  static async findById (orderId) {
    const oid = new mongodb.ObjectId(orderId);
    const order = await db.getDbConn().collection('orders').findOne({ _id: oid });
    return this.transformOrderDocument(order);
  }

  async save () {
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);
      await db.getDbConn().collection('orders').updateOne({ _id: orderId }, { $set: { status: this.status } });
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
