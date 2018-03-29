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
let clicked = require('./routes/clicked');
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
app.use('/clicked', clicked);
app.use('/stream', stream);


/*


START THE HTTP FETCHERS

 */
// IN
require('./remoteapi/india/zebpay').start();
require('./remoteapi/india/buyucoin').start();
require('./remoteapi/india/coinsecure').start();
require('./remoteapi/india/unocoin').start();
require('./remoteapi/india/coinome').start();
require('./remoteapi/india/coindelta').start();
require('./remoteapi/india/pocketbits').start();
require('./remoteapi/india/bitxoxo').start();
//require('./remoteapi/india/localbitcoins_in').start();
require('./remoteapi/india/bitbns').start();
require('./remoteapi/india/coinslab').start();


// JP
require('./remoteapi/japan/bitflyer').start();
require('./remoteapi/japan/coincheck').start();
require('./remoteapi/japan/zaif').start();
require('./remoteapi/japan/btcbox').start();
//require('./remoteapi/japan/localbitcoins_jp').start();
require('./remoteapi/japan/anxpro_jp').start();



//HK
require('./remoteapi/hongkong/gatecoin').start();
require('./remoteapi/hongkong/anxpro_hk').start();
//require('./remoteapi/hongkong/localbitcoins_hk').start();


//KR
require('./remoteapi/korea/korbit').start();
require('./remoteapi/korea/gopax').start();
//require('./remoteapi/korea/localbitcoins_kr').start();

//vn
//require('./remoteapi/vietnam/localbitcoins_vn').start();

//ca
require('./remoteapi/canada/quadrigacx').start();
require('./remoteapi/canada/ezbtc').start();
//require('./remoteapi/canada/localbitcoins_ca').start();

//se
require('./remoteapi/sweden/safello').start();
require('./remoteapi/sweden/fybsg_se').start();
//require('./remoteapi/sweden/localbitcoins_se').start();

//sg
require('./remoteapi/singapore/fybsg_sg').start();
//require('./remoteapi/singapore/localbitcoins_sg').start();


//us
require('./remoteapi/us/coinsquare').start();
require('./remoteapi/us/coinbase_us').start();
require('./remoteapi/us/bitstamp').start();
require('./remoteapi/us/kraken').start();
//require('./remoteapi/cryptonator').start();
require('./remoteapi/us/hibtc').start();
require('./remoteapi/us/gemini').start();
require('./remoteapi/us/itbit').start();
//require('./remoteapi/us/localbitcoins_us').start();
require('./remoteapi/us/exmo').start();
require('./remoteapi/us/bitex').start();

//gb
require('./remoteapi/england/coinfloor').start();
require('./remoteapi/england/coinbase_gb').start();
//require('./remoteapi/england/localbitcoins_gb').start();

//mx
require('./remoteapi/mexico/bitso').start();
require('./remoteapi/mexico/volabit').start();
//require('./remoteapi/mexico/localbitcoins_mx').start();

//pk
//require('./remoteapi/pakistan/localbitcoins_pk').start();

//ng
//require('./remoteapi/nigera/localbitcoins_ng').start();


//cl
require('./remoteapi/chile/buda').start();
//require('./remoteapi/chile/localbitcoins_cl').start();

//br
require('./remoteapi/brazil/mercado').start();
require('./remoteapi/brazil/flowbtc').start();
require('./remoteapi/brazil/bitcambio').start();

//ke
//require('./remoteapi/kenya/localbitcoins_ke').start();

//th
//require('./remoteapi/thailand/localbitcoins_th').start();

//IL
require('./remoteapi/israel/bit2c').start();

//many
require('./remoteapi/lumo').start();
require('./remoteapi/lakebtc').start();
require('./remoteapi/quione').start();
require('./remoteapi/localbitcoins').start();




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
