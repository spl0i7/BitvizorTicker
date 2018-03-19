let express = require('express');
const geoip = require('geoip-lite');
let router = express.Router();

router.get('/', function(req, res) {
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '')
                                        .split(',')[0].trim();
    res.json(
        {
            success : true,
            country : geoip.lookup(ip)['country']
        }
    );

});

module.exports = router;
