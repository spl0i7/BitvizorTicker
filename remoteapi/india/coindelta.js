let broadcast = require('../../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'CoinDelta';
const COUNTRY = 'IN';

const urls = {
    all:  'https://coindelta.com/api/v1/public/getticker/',
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
                    broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse[0]['Bid'], jsonResponse[0]['Ask']);
                    broadcast(COUNTRY, EXCHANGE, 'eth', jsonResponse[1]['Bid'], jsonResponse[1]['Ask']);
                    broadcast(COUNTRY, EXCHANGE, 'ltc', jsonResponse[2]['Bid'], jsonResponse[2]['Ask']);
                    broadcast(COUNTRY, EXCHANGE, 'omg', jsonResponse[3]['Bid'], jsonResponse[3]['Ask']);
                    broadcast(COUNTRY, EXCHANGE, 'qtum', jsonResponse[4]['Bid'], jsonResponse[4]['Ask']);
                    broadcast(COUNTRY, EXCHANGE, 'xrp', jsonResponse[9]['Bid'], jsonResponse[9]['Ask']);
                    broadcast(COUNTRY, EXCHANGE, 'bch', jsonResponse[11]['Bid'], jsonResponse[11]['Ask']);
                    broadcast(COUNTRY, EXCHANGE, 'zil', jsonResponse[12]['Bid'], jsonResponse[12]['Ask']);
                    broadcast(COUNTRY, EXCHANGE, 'zrx', jsonResponse[13]['Bid'], jsonResponse[13]['Ask']);
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