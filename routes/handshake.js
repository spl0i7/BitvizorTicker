let express = require('express');
const geoip = require('geoip-lite');
const currencydb = require('../config/currency');
let database = require('../memorydatabase').create();
let router = express.Router();
let money = require('money');
let oxr = require('oxr');
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
    console.log('Updated Currency');
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
    country = 'IN';
    res.json(
        {
            success : true,
            country : country,
            localCurrency :  currencydb[country]['symbol'],
            countries :  Object.keys(database),
            USDRate : money(1.0).from('USD').to('INR')
        }
    );

});

router.get('/currency/:country', function(req, res) {
    let country = req.params.country;
    res.json(
        {
            success: true,
            localCurrency :  currencydb[country]['symbol'],
        }
    );

});

module.exports = router;
