let broadcast = require('../model');
let request = require('request');
const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'Zaif';
const COUNTRY = 'JP';

const urls = {
    btc:  'https://api.zaif.jp/api/1/ticker/btc_jpy',
    xem:  'https://api.zaif.jp/api/1/ticker/xem_jpy',
    mona: 'https://api.zaif.jp/api/1/ticker/mona_jpy'
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