let broadcast = require('../../model');
let request = require('request');
const WAIT_TIME = 1000 * 60 * 7;
let logger = require('tracer').colorConsole();

const EXCHANGE = 'LocalBitcoins';
const COUNTRY = 'MX';

const urls = {
    btc : [
        'https://localbitcoins.com/sell-bitcoins-online/MX/national-bank-transfer/.json',
        'https://localbitcoins.com/buy-bitcoins-online/MX/national-bank-transfer/.json'
    ]
};

logger.info(`Starting ${COUNTRY}-${EXCHANGE} with refresh time ${WAIT_TIME} ms`);

function getHttp(url) {

    request(
        {
            method: 'GET',
            uri: url[0],
            gzip: true
        }, (err, res, body)=>{
       if(err){ console.log (err); }
       else {
           try {
               let jsonResponse_sell = JSON.parse(body);
               setTimeout(()=> {
                   request(
                       {
                           method: 'GET',
                           uri: url[1],
                           gzip: true
                       }, (err, res, body) => {
                           if (err) {
                               console.log(err);
                           }
                           else {
                               let jsonResponse_buy = JSON.parse(body);

                               broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse_sell['data']['ad_list'][0]['data']['temp_price'], jsonResponse_buy['data']['ad_list'][0]['data']['temp_price']);
                           }
                       });
               },1000);
           }
           catch(error){
               logger.warn(`Warning : Parsing Error from ${COUNTRY}-${EXCHANGE}` ,error);

           }

       }
    });
}

function startFetch() {
    for(let k in urls){
        setTimeout(()=>{getHttp(urls[k]);}, 1000 * 60 * 5 * Math.random());
        setInterval(()=>{
            getHttp(urls[k])
        }, WAIT_TIME);
    }
}

module.exports = {

    start : startFetch
};