var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Define the application routs.
var docs          = require('./routes/documents');
var participants  = require('./routes/participants'); 
var annotations   = require('./routes/annotations');
var entityTypes   = require('./routes/entity_types');
var entityMentions= require('./routes/entity_mentions');
var BrookerInvoke = require('./routes/brooker_invoke_route');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//USE the defined application routes.
app.use('/docs', attachCORSOptions, docs);
app.use('/participants', attachCORSOptions, participants);
app.use('/annotations', attachCORSOptions, annotations);
app.use('/entitytypes', attachCORSOptions, entityTypes);
app.use('/entities', attachCORSOptions, entityMentions);
app.use('/brookerInvoke', attachCORSOptions, BrookerInvoke);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Middleware 

function attachCORSOptions(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();     
}


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
            "status": 500,
            "errorMsg": err.message
        });
});

module.exports = app;
