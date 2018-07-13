let broadcast = require('../../../middlewares/price');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 2;
const EXCHANGE = 'Fybsg';
const COUNTRY = 'SE';

const urls = {
    btc:  'https://www.fybse.se/api/SEK/ticker.json',

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
                    broadcast(COUNTRY, EXCHANGE, currency, jsonResponse['bid'], jsonResponse['ask']);
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