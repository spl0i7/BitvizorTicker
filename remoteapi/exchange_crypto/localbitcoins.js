let broadcast = require('../../middlewares/price');
let request = require('request');
let logger = require('tracer').colorConsole();

const WAIT_TIME = 1000 * 60 * 4;
const EXCHANGE = 'LocalBitcoins';
const COUNTRIES = ['CL','CA', 'CN', 'GB', 'HK', 'IN', 'RU', 'IL', 'JP', 'KE', 'KR', 'MX', 'NG', 'PK', 'SG', 'SE', 'TH', 'US', 'VN'];



function getURL(country) {
    return [
        `https://localbitcoins.com/sell-bitcoins-online/${country}/national-bank-transfer/.json`,
        `https://localbitcoins.com/buy-bitcoins-online/${country}/national-bank-transfer/.json`
    ];
}

logger.info(`Starting ${EXCHANGE} with refresh time ${WAIT_TIME} ms`);

function doHTTP(url) {
    return new Promise((resolve, reject)=>{
        request(
            {
                method: 'GET',
                uri: url,
                gzip: true
            }, (err, res, body)=> {
                if(err) reject(err);
                try {
                    let parsed = JSON.parse(body);
                    resolve(parsed);
                }
                catch (e){
                    resolve({});
                }
            });
    });

}


async function getHttp(url, country) {
        try {
            let jsonSell = await doHTTP(url[0]);
            let jsonBuy = await doHTTP(url[1]);
            broadcast(country, EXCHANGE, 'btc', jsonSell['data']['ad_list'][0]['data']['temp_price'], jsonBuy['data']['ad_list'][0]['data']['temp_price']);
        }
        catch (err){
            logger.warn(`${country}, ${EXCHANGE} ERROR`, err);
        }
}

function timer(s){
    return new Promise(r=>setTimeout(r,s * 1000));
}

async function startFetch() {
    for(let c in COUNTRIES){
        await timer(2);
        let currentURL = getURL(COUNTRIES[c]);
        await getHttp(currentURL, COUNTRIES[c]);
    }

    setInterval(async ()=>{
        for(let c in COUNTRIES){
            await timer(2);
            let currentURL = getURL(COUNTRIES[c]);
            await getHttp(currentURL, COUNTRIES[c]);
        }
    }, WAIT_TIME);
}

module.exports = {

    start : startFetch
};