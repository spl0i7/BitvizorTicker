let broadcast = require('../../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 2;
const EXCHANGE = 'Exmo';
const COUNTRY = 'US';

const urls = {
    all:  'https://api.exmo.com/v1/ticker/',
};


logger.info(`Starting ${COUNTRY}-${EXCHANGE} with refresh time ${WAIT_TIME} ms`);


function getHttp(url) {

    request(
        {
            method: 'GET',
            uri: url,
            gzip: true
        }, (err, res, body)=>{
            if(err){ console.log (err); }
            else {
                try {
                    let jsonResponse = JSON.parse(body);
                    broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse['BTC_USD']['sell_price'], jsonResponse['BTC_USD']['buy_price']);
                    broadcast(COUNTRY, EXCHANGE, 'bch', jsonResponse['BCH_USD']['sell_price'], jsonResponse['BCH_USD']['buy_price']);
                    broadcast(COUNTRY, EXCHANGE, 'dash', jsonResponse['DASH_USD']['sell_price'], jsonResponse['DASH_USD']['buy_price']);
                    broadcast(COUNTRY, EXCHANGE, 'eth', jsonResponse['ETH_USD']['sell_price'], jsonResponse['ETH_USD']['buy_price']);
                    broadcast(COUNTRY, EXCHANGE, 'etc', jsonResponse['ETC_USD']['sell_price'], jsonResponse['ETC_USD']['buy_price']);
                    broadcast(COUNTRY, EXCHANGE, 'ltc', jsonResponse['LTC_USD']['sell_price'], jsonResponse['LTC_USD']['buy_price']);
                    broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse['BTC_USD']['sell_price'], jsonResponse['BTC_USD']['buy_price']);
                    broadcast(COUNTRY, EXCHANGE, 'zec', jsonResponse['ZEC_USD']['sell_price'], jsonResponse['ZEC_USD']['buy_price']);
                    broadcast(COUNTRY, EXCHANGE, 'xrp', jsonResponse['XRP_USD']['sell_price'], jsonResponse['XRP_USD']['buy_price']);
                    broadcast(COUNTRY, EXCHANGE, 'xmr', jsonResponse['XMR_USD']['sell_price'], jsonResponse['XMR_USD']['buy_price']);
                }
                catch(error){
                    logger.warn(`Warning : Parsing Error from ${COUNTRY}-${EXCHANGE}` ,error);

                }

            }
        });
}

function startFetch() {
    for(let k in urls){
        getHttp(urls[k]);
        setInterval(function() { getHttp(urls[k]) }, WAIT_TIME);
    }
}

module.exports = {
    start : startFetch
};