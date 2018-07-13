let broadcast = require('../../middlewares/price');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 3;
const EXCHANGE = 'Lumo';
const COUNTRY = 'NG-ZA';

const urls = {
    btc:  'https://api.mybitx.com/api/1/tickers',
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
                    for(let i = 0; i < jsonResponse['tickers'].length; i++) {
                        if(jsonResponse['tickers'][i]['pair'] === 'XBTNGN') {
                            broadcast('NG', EXCHANGE, currency, jsonResponse['tickers'][i]['bid'], jsonResponse['tickers'][i]['ask']);
                        }
                        else if(jsonResponse['tickers'][i]['pair'] === 'XBTZAR') {
                            broadcast('ZA', EXCHANGE, currency, jsonResponse['tickers'][i]['bid'], jsonResponse['tickers'][i]['ask']);
                        }
                    }
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