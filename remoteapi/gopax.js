let broadcast = require('../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'Gopax';
const COUNTRY = 'KR';

const urls = {
    btc:  'https://api.gopax.co.kr/trading-pairs/BTC-KRW/ticker',
    eth:  'https://api.gopax.co.kr/trading-pairs/ETH-KRW/ticker',
    bch:  'https://api.gopax.co.kr/trading-pairs/BCH-KRW/ticker',
    xlm:  'https://api.gopax.co.kr/trading-pairs/XLM-KRW/ticker',
    zec:  'https://api.gopax.co.kr/trading-pairs/ZEC-KRW/ticker',
    ltc:  'https://api.gopax.co.kr/trading-pairs/LTC-KRW/ticker',
    eng:  'https://api.gopax.co.kr/trading-pairs/ENG-KRW/ticker',
    cvc:  'https://api.gopax.co.kr/trading-pairs/CVC-KRW/ticker',
    cnd:  'https://api.gopax.co.kr/trading-pairs/CND-KRW/ticker',
    snt:  'https://api.gopax.co.kr/trading-pairs/SNT-KRW/ticker',
    zrx:  'https://api.gopax.co.kr/trading-pairs/ZRX-KRW/ticker',
    eos:  'https://api.gopax.co.kr/trading-pairs/EOS-KRW/ticker',
    omg:  'https://api.gopax.co.kr/trading-pairs/OMG-KRW/ticker',
    qtum:  'https://api.gopax.co.kr/trading-pairs/QTUM-KRW/ticker',
    mobi:  'https://api.gopax.co.kr/trading-pairs/MOBI-KRW/ticker',
    steem:  'https://api.gopax.co.kr/trading-pairs/STEEM-KRW/ticker',
    sbd:  'https://api.gopax.co.kr/trading-pairs/SBD-KRW/ticker',
    elf:  'https://api.gopax.co.kr/trading-pairs/ELF-KRW/ticker',
    qash:  'https://api.gopax.co.kr/trading-pairs/QASH-KRW/ticker',
    xrp:  'https://api.gopax.co.kr/trading-pairs/XRP-KRW/ticker',
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