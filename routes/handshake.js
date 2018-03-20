let express = require('express');
const geoip = require('geoip-lite');
const currencydb = require('../config/currency');
let database = require('../database').create();
let router = express.Router();

router.get('/', function(req, res) {
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '')
                                        .split(',')[0].trim();

    try {
        let country = geoip.lookup(ip)['country'];
    }
    catch(err){
        console.error(`Error Looking Up ${ip}`);
        if(ip === '127.0.0.1' || ip === '::1') {
            country = 'IN';
        }
    }
    res.json(
        {
            success : true,
            country : country,
            localCurrency :  currencydb[country],
            countries :  Object.keys(database),
        }
    );

});

router.get('/currency/:country', function(req, res) {
    let country = req.params.country;
    res.json(
        {
            success: true,
            localCurrency :  currencydb[country],
        }
    );

});

module.exports = router;
