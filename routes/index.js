let express = require('express');
let router = express.Router();
let database = require('../memorydatabase').create();
const currencyDB = require('../config/currency');
const countryDB = require('../config/countrycode');
const cryptoNameDB = require('../config/cryptocurrencies');

let analytics = require('./analytics');
let geoip = require('geoip-native-lite');
geoip.loadDataSync();
let countryDBInv = {};



let availableCountries = [];

for(let key in countryDB){
    countryDBInv[countryDB[key]] = key;
}

Object.keys(database).forEach(c=> availableCountries.push(countryDB[c]));
availableCountries.sort();


/* GET home page. */
router.get('/', function(req, res, next) {
    // let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '')
    //     .split(',')[0].trim();
    // let ipv6Reg = new RegExp('::ffff:');
    // if(ipv6Reg.test(ip)) {
    //     ip = ip.substr(ip.lastIndexOf(':') + 1);
    // }
    //
    // let country;
    // if(ip === '127.0.0.1' || ip === '::1') {
    //     country = 'IN';
    //     // FOR DEV MODE
    // }
    // else {
    //     country = geoip.lookup(ip).toUpperCase();
    // }
    //
    // if(!Object.keys(database).includes(country)) {
    //     country = 'US';
    //     //default to US
    // }
    return res.render('landing', {
        // prices : database[country],
        // localCurrency : currencyDB[country]['symbol'],
        // countryName: countryDB[country],
        averagePrice : analytics.getAverage(),
        availableCountries: availableCountries
    });

});


router.get('/*-live-prices', function(req, res, next) {
    let country = countryDBInv[getCountry(req.url)];


    if(database[country]) {

        return res.render('view_price', {
            prices: database[country],
            localCurrency: currencyDB[country]['symbol'],
            countryName: countryDB[country],
            availableCountries: availableCountries,
            cryptoNameDB : cryptoNameDB
        });
    }
    return res.render('not_supported');

});

function getCountry(urlPattern) {
    let regex  = /\/(\S+)-live-prices\/?/;
    if(!regex.test(urlPattern)) return null;

    let urlCountry = urlPattern.split(regex)[1];

    return urlCountry.split("-").map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(" ");

}



module.exports = router;
