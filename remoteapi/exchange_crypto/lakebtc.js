let broadcast = require('../../middlewares/price');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 3;
const EXCHANGE = 'Lakebtc';
const COUNTRY = 'US-GB-JPY';

const urls = {
    btc:  'https://api.lakebtc.com/api_v2/ticker'

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
                    broadcast('US', EXCHANGE, 'btc', jsonResponse['btcusd']['bid'], jsonResponse['btcusd']['bid']);
                    broadcast('JP', EXCHANGE, 'btc', jsonResponse['btcjpy']['bid'], jsonResponse['btcjpy']['ask']);
                    broadcast('GB', EXCHANGE, 'btc', jsonResponse['btcgbp']['bid'], jsonResponse['btcgbp']['ask']);
                }
                catch(error){
                    logger.warn(`Warning : Parsing Error from COUNTRY}-${EXCHANGE}` ,error);

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