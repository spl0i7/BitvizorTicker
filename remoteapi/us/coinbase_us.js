let broadcast = require('../../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 2;
const EXCHANGE = 'CoinBase';
const COUNTRY = 'US';

const urls = {
    btc:  ['https://api.coinbase.com/v2/prices/BTC-USD/buy', 'https://api.coinbase.com/v2/prices/BTC-USD/sell'],
    ltc:  ['https://api.coinbase.com/v2/prices/LTC-USD/buy', 'https://api.coinbase.com/v2/prices/LTC-USD/sell'],
    eth:  ['https://api.coinbase.com/v2/prices/ETH-USD/buy', 'https://api.coinbase.com/v2/prices/ETH-USD/sell'],
    bch:  ['https://api.coinbase.com/v2/prices/BCH-USD/buy', 'https://api.coinbase.com/v2/prices/BCH-USD/sell'],
};

logger.info(`Starting ${COUNTRY}-${EXCHANGE} with refresh time ${WAIT_TIME} ms`);


function getHttp(url, currency) {

    request(
        {
            method: 'GET',
            uri: url[0],
            gzip: true
        }, (err, res, body)=>{
            if(err){ console.log (err); }
            else {
                try {
                    let jsonResponse_buy = JSON.parse(body);
                    request(
                        {
                            method: 'GET',
                            uri: url[0],
                            gzip: true
                        }, (err, res, body)=>{
                            try {
                                let jsonResponse_sell = JSON.parse(body);


                                broadcast(COUNTRY, EXCHANGE, currency, parseFloat(jsonResponse_sell['data']['amount']), parseFloat(jsonResponse_buy['data']['amount']));

                            }
                            catch(error){
                                logger.warn(`Warning : Parsing Error from ${COUNTRY}-${EXCHANGE}` ,error);

                            }

                            });

                }
                catch(error){
                    logger.warn(`Warning : Parsing Error from ${COUNTRY}-${EXCHANGE}` ,error);

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