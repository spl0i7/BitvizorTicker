let broadcast = require('../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 2;
const EXCHANGE = 'Quadrigacx';
const COUNTRY = 'CA';

const urls = {
    all:  'https://api.quadrigacx.com/v2/ticker?book=all'

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
                    broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse['btc_cad']['bid'], jsonResponse['btc_cad']['ask']);
                    broadcast(COUNTRY, EXCHANGE, 'eth', jsonResponse['eth_cad']['bid'], jsonResponse['eth_cad']['ask']);
                    broadcast(COUNTRY, EXCHANGE, 'ltc', jsonResponse['ltc_cad']['bid'], jsonResponse['ltc_cad']['ask']);
                    broadcast(COUNTRY, EXCHANGE, 'bch', jsonResponse['bch_cad']['bid'], jsonResponse['bch_cad']['ask']);
                    broadcast(COUNTRY, EXCHANGE, 'btg', jsonResponse['btg_cad']['bid'], jsonResponse['btg_cad']['ask']);
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