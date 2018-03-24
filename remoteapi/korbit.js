let broadcast = require('../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'Korbit';
const COUNTRY = 'KR';

const urls = {
    btc:  'https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=btc_krw',
    bch:  'https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=bch_krw',
    etc:  'https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=etc_krw',
    xrp:  'https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=xrp_krw',
    eth:  'https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=eth_krw',
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