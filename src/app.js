const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser')
const csrf = require('csurf');

const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler')
const authRoutes = require('./routes/auth.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())
app.use(csrf({ cookie: true }));
app.use(addCsrfTokenMiddleware);

app.use(authRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase().then(() => {
  app.listen(3000);
}).catch((error) => {
  console.log('Failed to connect to the database!');
  console.log(error);
});
