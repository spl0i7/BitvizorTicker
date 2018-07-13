let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let sse = require('./middlewares/sse').middleware;
let sseConnections = require('./middlewares/sse').sseConnections;

let index = require('./routes/index');
let top100 = require('./routes/static');
let app = express();



// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', index);
app.use('/', top100);



/*


START THE HTTP FETCHERS

 */
// IN
require('./remoteapi/exchange_crypto/india/zebpay').start();
require('./remoteapi/exchange_crypto/india/buyucoin').start();
//require('./remoteapi/india/coinsecure').start();
//require('./remoteapi/india/unocoin').start();
require('./remoteapi/exchange_crypto/india/coinome').start();
require('./remoteapi/exchange_crypto/india/coindelta').start();
require('./remoteapi/exchange_crypto/india/pocketbits').start();
require('./remoteapi/exchange_crypto/india/bitxoxo').start();
//require('./remoteapi/india/localbitcoins_in').start();
require('./remoteapi/exchange_crypto/india/bitbns').start();
//require('./remoteapi/india/coinslab').start();


// JP
require('./remoteapi/exchange_crypto/japan/bitflyer').start();
require('./remoteapi/exchange_crypto/japan/coincheck').start();
require('./remoteapi/exchange_crypto/japan/zaif').start();
require('./remoteapi/exchange_crypto/japan/btcbox').start();
//require('./remoteapi/japan/localbitcoins_jp').start();
require('./remoteapi/exchange_crypto/japan/anxpro_jp').start();



//HK
require('./remoteapi/exchange_crypto/hongkong/gatecoin').start();
require('./remoteapi/exchange_crypto/hongkong/anxpro_hk').start();
//require('./remoteapi/hongkong/localbitcoins_hk').start();


//KR
require('./remoteapi/exchange_crypto/korea/korbit').start();
require('./remoteapi/exchange_crypto/korea/gopax').start();
//require('./remoteapi/korea/localbitcoins_kr').start();

//vn
//require('./remoteapi/vietnam/localbitcoins_vn').start();

//ca
require('./remoteapi/exchange_crypto/canada/quadrigacx').start();
require('./remoteapi/exchange_crypto/canada/ezbtc').start();
//require('./remoteapi/canada/localbitcoins_ca').start();

//se
require('./remoteapi/exchange_crypto/sweden/safello').start();
require('./remoteapi/exchange_crypto/sweden/fybsg_se').start();
//require('./remoteapi/sweden/localbitcoins_se').start();

//sg
require('./remoteapi/exchange_crypto/singapore/fybsg_sg').start();
//require('./remoteapi/singapore/localbitcoins_sg').start();


//us
require('./remoteapi/exchange_crypto/us/coinsquare').start();
require('./remoteapi/exchange_crypto/us/coinbase_us').start();
require('./remoteapi/exchange_crypto/us/bitstamp').start();
require('./remoteapi/exchange_crypto/us/kraken').start();
//require('./remoteapi/cryptonator').start();
require('./remoteapi/exchange_crypto/us/hibtc').start();
require('./remoteapi/exchange_crypto/us/gemini').start();
require('./remoteapi/exchange_crypto/us/itbit').start();
//require('./remoteapi/us/localbitcoins_us').start();
require('./remoteapi/exchange_crypto/us/exmo').start();
require('./remoteapi/exchange_crypto/us/bitex').start();

//gb
require('./remoteapi/exchange_crypto/england/coinfloor').start();
require('./remoteapi/exchange_crypto/england/coinbase_gb').start();
//require('./remoteapi/england/localbitcoins_gb').start();

//mx
require('./remoteapi/exchange_crypto/mexico/bitso').start();
require('./remoteapi/exchange_crypto/mexico/volabit').start();
//require('./remoteapi/mexico/localbitcoins_mx').start();

//pk
//require('./remoteapi/pakistan/localbitcoins_pk').start();

//ng
//require('./remoteapi/nigera/localbitcoins_ng').start();


//cl
require('./remoteapi/exchange_crypto/chile/buda').start();
//require('./remoteapi/chile/localbitcoins_cl').start();

//br
require('./remoteapi/exchange_crypto/brazil/mercado').start();
// require('./remoteapi/exchange_crypto/brazil/flowbtc').start();
require('./remoteapi/exchange_crypto/brazil/bitcambio').start();

//ke
//require('./remoteapi/kenya/localbitcoins_ke').start();

//th
//require('./remoteapi/thailand/localbitcoins_th').start();

//IL
require('./remoteapi/exchange_crypto/israel/bit2c').start();

//many
require('./remoteapi/exchange_crypto/lumo').start();
require('./remoteapi/exchange_crypto/lakebtc').start();
require('./remoteapi/exchange_crypto/quione').start();
require('./remoteapi/exchange_crypto/localbitcoins').start();




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

  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.json({
      success: false
  })
});

module.exports = app;
