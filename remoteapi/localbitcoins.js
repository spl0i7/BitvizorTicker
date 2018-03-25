let broadcast = require('../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 4;
const EXCHANGE = 'LocalBitcoins';
const COUNTRIES = ['CL','CA', 'GB', 'HK', 'IN', 'JP', 'KE', 'KR', 'MX', 'NG', 'PK', 'SG', 'SE', 'TH', 'US', 'VN'];



function getURL(country) {
    return [
            `https://localbitcoins.com/sell-bitcoins-online/${country}/national-bank-transfer/.json`,
            `https://localbitcoins.com/buy-bitcoins-online/${country}/national-bank-transfer/.json`
        ];
}

logger.info(`Starting ${EXCHANGE} with refresh time ${WAIT_TIME} ms`);


function getHttp(url, country) {

    logger.info('%j', url);
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
                               try {
                                   let jsonResponse_buy = JSON.parse(body);
                                   broadcast(country, EXCHANGE, 'btc', jsonResponse_sell['data']['ad_list'][0]['data']['temp_price'], jsonResponse_buy['data']['ad_list'][0]['data']['temp_price']);
                               }
                               catch (error) {
                                   logger.warn(`Warning : Parsing Error from ${EXCHANGE} ${country}`, error);
                               }
                           }
                       });
               }, 2000);


           }
           catch(error){
               logger.warn(`Warning : Parsing Error from ${EXCHANGE} ${country}` ,error);

           }

       }
    });
}


function startFetch() {
    for(let c in COUNTRIES){

        let currentURL = getURL(COUNTRIES[c]);
        setTimeout(()=>{
            getHttp(currentURL, COUNTRIES[c]);
        }, 1000 * 60 * (Math.random() * (2 - 1) + 1) + Math.random() * 5000);
        setInterval(()=>{
            getHttp(currentURL, COUNTRIES[c]);
        }, 1000 * 60 * (Math.random() * (10 - 5) + 5) + Math.random() * 1000);
    }
}

module.exports = {

    start : startFetch
};