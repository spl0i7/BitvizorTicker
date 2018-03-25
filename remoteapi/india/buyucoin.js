let broadcast = require('../../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'BuyUCoin';
const COUNTRY = 'IN';

const urls = {
    btc:  'https://www.buyucoin.com/api/v1.2/currency/btc',
    eth : 'https://www.buyucoin.com/api/v1.2/currency/eth',
    ltc : 'https://www.buyucoin.com/api/v1.2/currency/ltc',
    bcc : 'https://www.buyucoin.com/api/v1.2/currency/bcc',
    xmr : 'https://www.buyucoin.com/api/v1.2/currency/xmr',
    qtum: 'https://www.buyucoin.com/api/v1.2/currency/qtum',
    etc:  'https://www.buyucoin.com/api/v1.2/currency/etc',
    zec:  'https://www.buyucoin.com/api/v1.2/currency/zec',
    xem:  'https://www.buyucoin.com/api/v1.2/currency/xem',
    gnt:  'https://www.buyucoin.com/api/v1.2/currency/gnt',
    neo:  'https://www.buyucoin.com/api/v1.2/currency/neo',
    xrp:  'https://www.buyucoin.com/api/v1.2/currency/xrp',
    dash: 'https://www.buyucoin.com/api/v1.2/currency/dash',
    strat:'https://www.buyucoin.com/api/v1.2/currency/strat',
    steem:'https://www.buyucoin.com/api/v1.2/currency/steem',
    rep:  'https://www.buyucoin.com/api/v1.2/currency/rep',
    lsk:  'https://www.buyucoin.com/api/v1.2/currency/lsk',
    fct:  'https://www.buyucoin.com/api/v1.2/currency/fct',
    omg:  'https://www.buyucoin.com/api/v1.2/currency/omg',
    cvc:  'https://www.buyucoin.com/api/v1.2/currency/cvc',
    sc:   'https://www.buyucoin.com/api/v1.2/currency/sc',
    pay:  'https://www.buyucoin.com/api/v1.2/currency/pay',
    ark:  'https://www.buyucoin.com/api/v1.2/currency/ark',
    doge: 'https://www.buyucoin.com/api/v1.2/currency/doge',
    dgb:  'https://www.buyucoin.com/api/v1.2/currency/dgb',
    nxt:  'https://www.buyucoin.com/api/v1.2/currency/nxt',
    bat:  'https://www.buyucoin.com/api/v1.2/currency/bat',
    bts:  'https://www.buyucoin.com/api/v1.2/currency/bts',
    cloak:'https://www.buyucoin.com/api/v1.2/currency/cloak',
    pivx: 'https://www.buyucoin.com/api/v1.2/currency/pivx',
    dcn:  'https://www.buyucoin.com/api/v1.2/currency/dcn',
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
                    broadcast(COUNTRY, EXCHANGE, currency, jsonResponse['data']['bid'], jsonResponse['data']['ask']);
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