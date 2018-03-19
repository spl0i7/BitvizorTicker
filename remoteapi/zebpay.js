let broadcast = require('../model');
let request = require('request');
const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'ZebPay';
const COUNTRY = 'IN';

const urls = {
    btc : 'https://www.zebapi.com/api/v1/market/ticker-new/btc/inr',
    bch : 'https://www.zebapi.com/api/v1/market/ticker-new/bch/inr',
    eth : 'https://www.zebapi.com/api/v1/market/ticker-new/eth/inr',
    ltc : 'https://www.zebapi.com/api/v1/market/ticker-new/ltc/inr',
    xrp : 'https://www.zebapi.com/api/v1/market/ticker-new/xrp/inr',
};

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
               broadcast(COUNTRY, EXCHANGE, currency, jsonResponse['sell'], jsonResponse['buy']);
           }
           catch(error){
               console.log(`Warning : Parsing Error from ${EXCHANGE}` ,error);

           }

       }
    });
}

function startFetch() {
    for(let k in urls){
        getHttp(urls[k], k);
        setInterval(()=>getHttp(urls[k], k), WAIT_TIME);
    }
}

module.exports = {

    start : startFetch
};