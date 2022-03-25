const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
  constructor (email, password, fullname, street, city, postal) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.address = {
      street: street,
      city: city,
      postalCode: postal
    };
  }

  async signup () {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDbConn().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.fullname,
      address: this.address
    });
  }

  async isAlreadyCreated () {
    const existingUser = await this.getUserSameEmail();
    return !!existingUser;
  }

  static async findById (userId) {
    let uid;
    try {
      uid = new mongodb.ObjectId(userId);
    } catch (e) {
      e.code = 404;
      throw e;
    }

    const user = await db.getDbConn().collection('users').findOne({ _id: uid }, { projection: { password: 0 } });

    console.log(user);

    if (!user) {
      const error = new Error('Could not find the user with the id provided.');
      error.code = 404;
      throw error;
    }

    return user;
  }

  getUserSameEmail () {
    return db.getDbConn().collection('users').findOne({ email: this.email });
  }

  hasMatchingPassword (hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
