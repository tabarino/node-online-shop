const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

function createSessionStore() {
  const store = new MongoDbStore({
    uri: 'mongodb://localhost:27017',
    databaseName: 'online-shop',
    collection: 'sessions'
  });

  return store;
}

function createSessionConfig () {
  return {
    secret: 'ts@4534ljkp',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
    }
  };
}

module.exports = createSessionConfig;
