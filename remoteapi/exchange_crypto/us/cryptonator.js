let broadcast = require('../../../middlewares/price');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 3;
const EXCHANGE = 'Cryptonator';
const COUNTRY = 'US';

const urls = {
    btc:  'https://api.cryptonator.com/api/ticker/btc-usd?fa821dba_ipp_uid2=NKOmUOAx6837kbY0%2fDDDRJ2CL%2fhRU5V4qwR4Mjg%3d%3d&fa821dba_ipp_uid1=1521951755184&fa821dba_ipp_key=1521951755184%2FaDeM38ghe4qm%2f8j%2b2ps71g%3d%3d',
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
                    broadcast(COUNTRY, EXCHANGE, currency, jsonResponse['ticker']['price'], jsonResponse['ticker']['price']);
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