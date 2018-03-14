const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const book = require('./api/routes/book');
const doingsRoutes = require('./api/routes/doings');
const targetsRoutes = require('./api/routes/targets');
const topsRoutes = require('./api/routes/tops');
const usersRoutes = require('./api/routes/users');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(
  'mongodb://nodejs-rest:' +
    'nodejs-rest' +
    '@nodejs-rest-shard-00-00-vwe6k.mongodb.net:27017,nodejs-rest-shard-00-01-vwe6k.mongodb.net:27017,nodejs-rest-shard-00-02-vwe6k.mongodb.net:27017/test?ssl=true&replicaSet=nodejs-rest-shard-0&authSource=admin',
  {
    promiseLibrary: require('bluebird')
  }
);
// nodejs-rest
// secret-jwt-key
// mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/books', express.static(path.join(__dirname, 'dist')));
app.use('/book', book);
app.use('/api/doingss', express.static(path.join(__dirname, 'dist')));
app.use('/api/doings', doingsRoutes);
app.use('/api/targetss', express.static(path.join(__dirname, 'dist')));
app.use('/api/targets', targetsRoutes);
app.use('/api/topss', express.static(path.join(__dirname, 'dist')));
app.use('/api/tops', topsRoutes);
app.use('/api/userss', express.static(path.join(__dirname, 'dist')));
app.use('/api/users', usersRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile('/Projects/gamification/gamification/dist/index.html');
});

app.set('view engine', 'html');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running`);
})

module.exports = app;