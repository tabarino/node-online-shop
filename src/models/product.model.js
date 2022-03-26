const mongodb = require('mongodb');

const db = require('../data/database');

class Product {
  constructor (productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.description = productData.description;
    this.price = +productData.price;
    this.image = productData.image;
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findAll () {
    const products = await db.getDbConn().collection('products').find().toArray();
    return products.map(productDocument => new Product(productDocument));
  }

  static async findById (id) {
    let productId;
    try {
      productId = new mongodb.ObjectId(id);
    } catch (e) {
      e.code = 404;
      throw e;
    }

    const product = await db.getDbConn().collection('products').findOne({ _id: productId });

    if (!product) {
      const error = new Error('Could not find product with id provided.');
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  static async findMultiple (ids) {
    const productIds = ids.map(id => new mongodb.ObjectId(id));
    const products = await db.getDbConn().collection('products').find({ _id: { $in: productIds } }).toArray();
    return products.map(productDocument => new Product(productDocument));
  }

  async save () {
    const productData = {
      title: this.title,
      summary: this.summary,
      description: this.description,
      price: this.price,
      image: this.image
    }

    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete productData.image;
      }

      await db.getDbConn().collection('products').updateOne({ _id: productId }, { $set: productData });
    } else {
      await db.getDbConn().collection('products').insertOne(productData);
    }
  }

  async remove () {
    const productId = new mongodb.ObjectId(this.id);
    await db.getDbConn().collection('products').deleteOne({ _id: productId })
  }

  updateImageData () {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  replaceImage (newImage) {
    this.image = newImage;
    this.updateImageData();
  }
}

module.exports = Product;
