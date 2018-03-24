let broadcast = require('../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'Gatecoin';
const COUNTRY = 'HK';

const urls = {
    all:  'https://api.gatecoin.com/Public/LiveTickers',
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
                    for(let i = 0 ; i < jsonResponse['tickers'].length; i++){
                        if(jsonResponse['tickers'][i]['currencyPair'] === 'BTCHKD') {
                            broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse['tickers'][i]['bid'], jsonResponse['tickers'][i]['ask']);
                        }
                        else if(jsonResponse['tickers'][i]['currencyPair'] === 'ETHHKD') {
                            broadcast(COUNTRY, EXCHANGE, 'eth', jsonResponse['tickers'][i]['bid'], jsonResponse['tickers'][i]['ask']);

                        }
                        else if(jsonResponse['tickers'][i]['currencyPair'] === 'LTCHKD') {
                            broadcast(COUNTRY, EXCHANGE, 'ltc', jsonResponse['tickers'][i]['bid'], jsonResponse['tickers'][i]['ask']);
                        }
                    }
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