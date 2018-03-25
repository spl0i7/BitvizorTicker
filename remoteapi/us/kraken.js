let broadcast = require('../../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 2;
const EXCHANGE = 'Kraken';
const COUNTRY = 'US';

const urls = {
    usdt:  'https://api.kraken.com/0/public/Ticker?pair=USDTZUSD',
    bch:  'https://api.kraken.com/0/public/Ticker?pair=BCHUSD',
    dash:  'https://api.kraken.com/0/public/Ticker?pair=DASHUSD',
    eos:  'https://api.kraken.com/0/public/Ticker?pair=EOSUSD',
    gno:  'https://api.kraken.com/0/public/Ticker?pair=GNOUSD',
    etc:  'https://api.kraken.com/0/public/Ticker?pair=XETCZUSD',
    eth:  'https://api.kraken.com/0/public/Ticker?pair=XETHZUSD',
    ltc:  'https://api.kraken.com/0/public/Ticker?pair=XLTCZUSD',
    rep:  'https://api.kraken.com/0/public/Ticker?pair=XREPZUSD',
    xbt:  'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD',
    xmr:  'https://api.kraken.com/0/public/Ticker?pair=XXMRZUSD',
    xrp:  'https://api.kraken.com/0/public/Ticker?pair=XXRPZUSD',
    zec:  'https://api.kraken.com/0/public/Ticker?pair=XZECZUSD',

};

logger.info(`Starting ${COUNTRY}-${EXCHANGE} with refresh time ${WAIT_TIME} ms`);


function getHttp(url, currency) {

    request(
        {
            method: 'GET',
            uri: url,
            gzip: true
        }, (err, res, body)=>{
            if(err){ console.log (err); }
            else {
                try {
                    let name = url.split('=');
                    let jsonResponse = JSON.parse(body);
                    broadcast(COUNTRY, EXCHANGE, currency, jsonResponse['result'][name[1]]['b'][0], jsonResponse['result'][name[1]]['a'][0]);
                }
                catch(error){
                    logger.warn(`Warning : Parsing Error from COUNTRY}-${EXCHANGE}` ,error, url);

                }

            }
        });
}

function startFetch() {
    for(let k in urls){
        getHttp(urls[k], k);
        setInterval(function() { getHttp(urls[k], k) }, WAIT_TIME);
    }
}

module.exports = {
    start : startFetch
};