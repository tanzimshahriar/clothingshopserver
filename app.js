require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
var bodyParser = require('body-parser');
const mongoose = require('mongoose')

//set database
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log("connected to database"))
.catch(e => console.log(e+" database not connected"));

const app = express();
const cors = require('cors');


//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: false
}));
if (process.env.NODE_ENV == "production") {
  const allowedCorsSites = {
    origin: "https://assignment-two-app.appspot.com"
  }
  app.use(cors(allowedCorsSites));
} else {
  app.use(cors())
}


//routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

app.get('/', (req, res, next) => {
  res.send("THIS IS THE API")
});
app.use(userRoutes);
app.use(productRoutes);

//start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Server started');
  } else {
    console.log(`App listening on port ${PORT}`);
  }
});

module.exports = app;