let broadcast = require('../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'Coinslab';
const COUNTRY = 'IN';

const urls = {
    btc:  'https://www.coinslab.com/api/v1/ticker/btc/inr',
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
                    let jsonResponse = JSON.parse(body);
                    broadcast(COUNTRY, EXCHANGE, currency, jsonResponse['sell'], jsonResponse['buy']);
                }
                catch(error){
                    logger.warn(`Warning : Parsing Error from COUNTRY}-${EXCHANGE}` ,error);

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