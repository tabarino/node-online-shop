const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase () {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  database = client.db('online-shop');
}

function getDbConn () {
  if (!database) {
    throw new Error('You must connect to the database first!')
  }
  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDbConn: getDbConn
};
