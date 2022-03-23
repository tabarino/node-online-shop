const bcrypt = require('bcryptjs');

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
}

module.exports = User;
