let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let sse = require('./middlewares/sse').middleware;
let sseConnections = require('./middlewares/sse').sseConnections;

let index = require('./routes/index');
let stream = require('./routes/stream');
let country = require('./routes/handshake');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(sse);
app.use('/', index);
app.use('/handshake', country);
app.use('/stream', stream);


/*


START THE HTTP FETCHERS

 */
// IN
require('./remoteapi/zebpay').start();
require('./remoteapi/buyucoin').start();
require('./remoteapi/coinsecure').start();
require('./remoteapi/unocoin').start();
require('./remoteapi/coinome').start();
require('./remoteapi/coindelta').start();
require('./remoteapi/pocketbits').start();
require('./remoteapi/bitxoxo').start();
require('./remoteapi/localbitcoins_in').start();
require('./remoteapi/bitbns').start();
require('./remoteapi/coinslab').start();


// JP
require('./remoteapi/bitflyer').start();
require('./remoteapi/coincheck').start();
require('./remoteapi/zaif').start();
require('./remoteapi/btcbox').start();
require('./remoteapi/localbitcoins_jp').start();
require('./remoteapi/anxpro_jp').start();



//HK
require('./remoteapi/gatecoin').start();
require('./remoteapi/anxpro_hk').start();
require('./remoteapi/localbitcoins_hk').start();


//KR
require('./remoteapi/korbit').start();
require('./remoteapi/gopax').start();
require('./remoteapi/localbitcoins_kr').start();

//vn
require('./remoteapi/localbitcoins_vn').start();

//ca
require('./remoteapi/coinsquare').start();
require('./remoteapi/quadrigacx').start();
require('./remoteapi/ezbtc').start();
require('./remoteapi/localbitcoins_ca').start();

//se
require('./remoteapi/safello').start();
require('./remoteapi/fybsg_se').start();
require('./remoteapi/localbitcoins_se').start();

//sg
require('./remoteapi/fybsg_sg').start();
require('./remoteapi/localbitcoins_sg').start();


//us
require('./remoteapi/coinbase').start();


//require('./remoteapi/coinhako').start();


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
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
      success: false
  })
});

module.exports = app;
