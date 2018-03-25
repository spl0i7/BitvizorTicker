let broadcast = require('../../model');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 30;
const EXCHANGE = 'Bitbns';
const COUNTRY = 'IN';

const urls = {
    all:  'https://bitbns.com/order/getTickerWithVolume/',
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
                    broadcast(COUNTRY, EXCHANGE, 'btc', jsonResponse['BTC']['lowest_sell_bid'], jsonResponse['BTC']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'xrp', jsonResponse['XRP']['lowest_sell_bid'], jsonResponse['XRP']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'neo', jsonResponse['NEO']['lowest_sell_bid'], jsonResponse['NEO']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'gas', jsonResponse['GAS']['lowest_sell_bid'], jsonResponse['GAS']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'eth', jsonResponse['ETH']['lowest_sell_bid'], jsonResponse['ETH']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'xlm', jsonResponse['XLM']['lowest_sell_bid'], jsonResponse['XLM']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'rpx', jsonResponse['RPX']['lowest_sell_bid'], jsonResponse['RPX']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'dbc', jsonResponse['DBC']['lowest_sell_bid'], jsonResponse['DBC']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'ltc', jsonResponse['LTC']['lowest_sell_bid'], jsonResponse['LTC']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'xmr', jsonResponse['XMR']['lowest_sell_bid'], jsonResponse['XMR']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'dash', jsonResponse['DASH']['lowest_sell_bid'], jsonResponse['DASH']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'doge', jsonResponse['DOGE']['lowest_sell_bid'], jsonResponse['DOGE']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'bch', jsonResponse['BCH']['lowest_sell_bid'], jsonResponse['BCH']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'trx', jsonResponse['TRX']['lowest_sell_bid'], jsonResponse['TRX']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'etn', jsonResponse['ETN']['lowest_sell_bid'], jsonResponse['ETN']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'ont', jsonResponse['ONT']['lowest_sell_bid'], jsonResponse['ONT']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'zil', jsonResponse['ZIL']['lowest_sell_bid'], jsonResponse['ZIL']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'eos', jsonResponse['EOS']['lowest_sell_bid'], jsonResponse['EOS']['highest_buy_bid']);
                    broadcast(COUNTRY, EXCHANGE, 'poly', jsonResponse['POLY']['lowest_sell_bid'], jsonResponse['POLY']['highest_buy_bid']);
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