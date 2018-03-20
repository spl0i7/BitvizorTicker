let broadcast = require('../model');
let request = require('request');
const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'CoinCheck';
const COUNTRY = 'JP';

const urls = {
    btc:  'https://coincheck.com/api/ticker',
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
                    broadcast(COUNTRY, EXCHANGE, currency, jsonResponse['bid'], jsonResponse['ask']);
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
        setInterval(function() { getHttp(urls[k], k) }, WAIT_TIME);
    }
}

module.exports = {
    start : startFetch
};