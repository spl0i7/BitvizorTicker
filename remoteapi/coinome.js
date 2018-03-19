let broadcast = require('../model');
let request = require('request');
const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'Coinome';
const COUNTRY = 'IN';

const urls = {
    all:  'https://www.coinome.com/api/v1/ticker.json',
};

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
                    broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse['btc-inr']['highest_bid'], jsonResponse['btc-inr']['lowest_ask']);
                    broadcast(COUNTRY, EXCHANGE, 'bch', jsonResponse['bch-inr']['highest_bid'], jsonResponse['bch-inr']['lowest_ask']);
                    broadcast(COUNTRY, EXCHANGE, 'ltc', jsonResponse['ltc-inr']['highest_bid'], jsonResponse['ltc-inr']['lowest_ask']);
                    broadcast(COUNTRY, EXCHANGE, 'dash', jsonResponse['dash-inr']['highest_bid'], jsonResponse['dash-inr']['lowest_ask']);
                    broadcast(COUNTRY, EXCHANGE, 'dgb', jsonResponse['dgb-inr']['highest_bid'], jsonResponse['dgb-inr']['lowest_ask']);
                    broadcast(COUNTRY, EXCHANGE, 'zec', jsonResponse['zec-inr']['highest_bid'], jsonResponse['zec-inr']['lowest_ask']);
                    broadcast(COUNTRY, EXCHANGE, 'qtum', jsonResponse['qtum-inr']['highest_bid'], jsonResponse['qtum-inr']['lowest_ask']);
                    broadcast(COUNTRY, EXCHANGE, 'btg', jsonResponse['btg-inr']['highest_bid'], jsonResponse['btg-inr']['lowest_ask']);
                }
                catch(error){
                    console.log(`Warning : Parsing Error from ${EXCHANGE}` ,error);

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