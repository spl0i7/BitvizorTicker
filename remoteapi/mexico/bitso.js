let broadcast = require('../../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 2;
const EXCHANGE = 'Bitso';
const COUNTRY = 'MX';

const urls = {
    all:  'https://api.bitso.com/v3/ticker/',
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
                    for(let i = 0; i < jsonResponse['payload'].length; i++){
                        if(jsonResponse['payload'][i]['book'] === 'btc_mxn'){
                            broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse['payload'][i]['bid'], jsonResponse['payload'][i]['ask']);
                        }
                        else if(jsonResponse['payload'][i]['book'] === 'eth_mxn'){
                            broadcast(COUNTRY, EXCHANGE, 'eth', jsonResponse['payload'][i]['bid'], jsonResponse['payload'][i]['ask']);
                        }
                        else if(jsonResponse['payload'][i]['book'] === 'xrp_mxn'){
                            broadcast(COUNTRY, EXCHANGE, 'xrp', jsonResponse['payload'][i]['bid'], jsonResponse['payload'][i]['ask']);
                        }
                        else if(jsonResponse['payload'][i]['book'] === 'bch_mxn'){
                            broadcast(COUNTRY, EXCHANGE, 'bch', jsonResponse['payload'][i]['bid'], jsonResponse['payload'][i]['ask']);
                        }
                        else if(jsonResponse['payload'][i]['book'] === 'ltc_mxn'){
                            broadcast(COUNTRY, EXCHANGE, 'ltc', jsonResponse['payload'][i]['bid'], jsonResponse['payload'][i]['ask']);
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