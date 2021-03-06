var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var keywordExtractor = require('./routes/keyword_extractor');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', keywordExtractor);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
  res.json({
            "status": 500,
            "msg": "An Error Occurred",
            "errorMsg": err.message 
        });
});

module.exports = app;
