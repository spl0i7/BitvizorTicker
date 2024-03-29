let express = require('express');
const currencydb = require('../config/currency');
let database = require('../memorydatabase').create();
let countryCode = require('../config/countrycode');
let router = express.Router();
let money = require('money');
let oxr = require('oxr');
let logger = require('tracer').colorConsole();
let geoip = require('geoip-native-lite');

let mysql = require('../config/mysqldb');

// Must load data before lookups can be performed.
geoip.loadDataSync();

// THIS module maybe doing too much work
let service = oxr.factory({
    appId: '86b9b766e9f941f8a6b873fd7ef61312'
});


service = oxr.cache({
    method: 'latest',
    ttl: 7 * 24 * 1000 * 3600,
    store: {
        get: function () {
            return Promise.resolve(this.value)
        },
        put: function (value) {
            this.value = value;
            return Promise.resolve(this.value)
        }
    }
}, service);

service.latest().then(function(result){

    logger.info('Updated currency values');

    money.rates = result.rates;
});




router.get('/', function(req, res) {
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '')
                                        .split(',')[0].trim();
    let ipv6Reg = new RegExp('::ffff:');
    if(ipv6Reg.test(ip)) {
        ip = ip.substr(ip.lastIndexOf(':') + 1);
    }

    let country;
    if(ip === '127.0.0.1' || ip === '::1') {
        country = 'IN';
        // FOR DEV MODE
    }
    else {
        country = geoip.lookup(ip).toUpperCase();
    }

    let supportedCounties = Object.keys(database);
    let countryNames = {};
    for(let i = 0; i < supportedCounties.length; i++){
        let name = supportedCounties[i];

        countryNames[name] = countryCode[name];
    }

    if(!supportedCounties.includes(country)) {
        country = 'US';
        //default to US
    }
    res.json(
        {
            success : true,
            country : country,
            localCurrency :  currencydb[country]['symbol'],
            countries :  supportedCounties,
            countryNames : countryNames,
            USDRate : money(1.0).from('USD').to(currencydb[country]['name']),
            countryName : countryCode[country]
        }
    );

});


module.exports = router;
