let broadcast = require('../../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 2;
const EXCHANGE = 'HiBitcoin';
const COUNTRY = 'US';

const urls = {
    all:  'https://api.hitbtc.com/api/2/public/ticker',
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
                    for(let i = 0; i < jsonResponse.length; i++){
                        if(jsonResponse[i]['symbol'] === 'BTCUSD'){
                            broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse[i]['bid'], jsonResponse[i]['ask']);
                        }
                        else if(jsonResponse[i]['symbol'] === 'LTCUSD'){
                            broadcast(COUNTRY, EXCHANGE, 'ltc', jsonResponse[i]['bid'], jsonResponse[i]['ask']);
                        }
                        else if(jsonResponse[i]['symbol'] === 'XMRUSD'){
                            broadcast(COUNTRY, EXCHANGE, 'xmr', jsonResponse[i]['bid'], jsonResponse[i]['ask']);
                        }
                        else if(jsonResponse[i]['symbol'] === 'DASHUSD'){
                            broadcast(COUNTRY, EXCHANGE, 'dash', jsonResponse[i]['bid'], jsonResponse[i]['ask']);
                        }
                        else if(jsonResponse[i]['symbol'] === 'ETHUSD'){
                            broadcast(COUNTRY, EXCHANGE, 'eth', jsonResponse[i]['bid'], jsonResponse[i]['ask']);
                        }
                        else if(jsonResponse[i]['symbol'] === 'ZECUSD'){
                            broadcast(COUNTRY, EXCHANGE, 'zec', jsonResponse[i]['bid'], jsonResponse[i]['ask']);
                        }
                        else if(jsonResponse[i]['symbol'] === 'EOSUSD'){
                            broadcast(COUNTRY, EXCHANGE, 'eos', jsonResponse[i]['bid'], jsonResponse[i]['ask']);
                        }
                        else if(jsonResponse[i]['symbol'] === 'OMGUSD'){
                            broadcast(COUNTRY, EXCHANGE, 'omg', jsonResponse[i]['bid'], jsonResponse[i]['ask']);
                        }
                        else if(jsonResponse[i]['symbol'] === 'BCHUSD'){
                            broadcast(COUNTRY, EXCHANGE, 'bch', jsonResponse[i]['bid'], jsonResponse[i]['ask']);
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