
let database = require('../memorydatabase').create();
let currencyDB = require('../config/currency');

function getAverage() {

    const INTERESTING_COUNTRIES = ['IN', 'US', 'CA', 'JP', 'GB', 'KR', 'MX', 'HK'];
    let averageResult = {};
    INTERESTING_COUNTRIES.forEach(e=> {
        averageResult[e] = {
            'eth' : 0,
            'btc' : 0
        }
    });

    INTERESTING_COUNTRIES.forEach(c => {

        let ethTotal = 0;
        let btcTotal = 0;

        let exchanges = database[c];
        Object.keys(exchanges).forEach(e => {
            if(exchanges[e]['eth']){
                averageResult[c]['eth'] += Number.parseInt(exchanges[e]['eth']['buy']);
                ethTotal += 1;
            }
            if(exchanges[e]['btc']){
                averageResult[c]['btc'] += Number.parseInt(exchanges[e]['btc']['buy']);
                btcTotal += 1;
            }
        });

        averageResult[c]['eth'] = currencyDB[c]['symbol'] + Number.parseInt(averageResult[c]['eth'] / ethTotal);
        averageResult[c]['btc'] = currencyDB[c]['symbol'] + Number.parseInt(averageResult[c]['btc'] / ethTotal);
    });

    console.log(averageResult);

    return averageResult;


}
module.exports = {
    getAverage : getAverage,
};

