const db = require('../data/database');

class Product {
  constructor (productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.description = productData.description;
    this.price = +productData.price;
    this.image = productData.image;
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findAll () {
    const products = await db.getDbConn().collection('products').find().toArray();
    return products.map(productDocument => new Product(productDocument));
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      description: this.description,
      price: this.price,
      image: this.image
    }
    await db.getDbConn().collection('products').insertOne(productData);
  }
}

module.exports = Product;
