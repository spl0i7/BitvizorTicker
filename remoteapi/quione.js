let broadcast = require('../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 2;
const EXCHANGE = 'Quione';
const COUNTRY = 'JP-US';

const urls = {
    all:  'https://api.quoine.com/products',
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
                    for(let i = 0 ; i < jsonResponse.length; i++){


                        if(jsonResponse[i]['currency_pair_code'] === 'BTCUSD'){
                            broadcast('US', EXCHANGE, 'btc', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
                        }
                        else if(jsonResponse[i]['currency_pair_code'] === 'BCHUSD'){
                            broadcast('US', EXCHANGE, 'bch', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
                        }
                        else if(jsonResponse[i]['currency_pair_code'] === 'ETHUSD'){
                            broadcast('US', EXCHANGE, 'eth', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
                        }
                        else if(jsonResponse[i]['currency_pair_code'] === 'XRPUSD'){
                            broadcast('US', EXCHANGE, 'xrp', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
                        }
                        else if(jsonResponse[i]['currency_pair_code'] === 'QTUMUSD'){
                            broadcast('US', EXCHANGE, 'qtum', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
                        }


                        else if(jsonResponse[i]['currency_pair_code'] === 'BCHJPY'){
                            broadcast('JP', EXCHANGE, 'bch', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
                        }
                        else if(jsonResponse[i]['currency_pair_code'] === 'BTCJPY'){
                            broadcast('JP', EXCHANGE, 'btc', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
                        }
                        else if(jsonResponse[i]['currency_pair_code'] === 'ETHJPY'){
                            broadcast('JP', EXCHANGE, 'eth', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
                        }
                        else if(jsonResponse[i]['currency_pair_code'] === 'XRPJPY'){
                            broadcast('JP', EXCHANGE, 'xrp', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
                        }
                        else if(jsonResponse[i]['currency_pair_code'] === 'QTUMJPY'){
                            broadcast('JP', EXCHANGE, 'qtum', jsonResponse[i]['market_bid'], jsonResponse[i]['market_ask']);
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
        getHttp(urls[k]);
        setInterval(function() { getHttp(urls[k]) }, WAIT_TIME);
    }
}

module.exports = {
    start : startFetch
};