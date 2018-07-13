let broadcast = require('../../../middlewares/price');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 2;
const EXCHANGE = 'Volabit';
const COUNTRY = 'MX';

const urls = {
    all:  'https://www.volabit.com/api/v1/tickers',
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
                    broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse['btc_mxn_sell'], jsonResponse['btc_mxn_buy']);
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