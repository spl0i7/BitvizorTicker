let express = require('express');
let router = express.Router();
let logger = require('tracer').colorConsole();
let mysql = require('../config/mysqldb');

//create table click_stats(ip varchar(20) not null, timestamp datetime not null, exchange varchar(50) not null, currency varchar(5) not null);

async function storeClicks(ip, exchange, currency){

    return new Promise((resolve, reject)=>{
            mysql.query({
                sql : "INSERT INTO click_stats(`ip`,`timestamp`,`exchange`,`currency`) VALUES(?,NOW(),?,?)",
                values : [ip, exchange, currency],
                timeout : 4000,
            }, (err, results, fields)=>{
                if(err) reject(err);
                else resolve();
            });

    });

}



router.get('/:alias/:currency', async function(req, res) {
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '')
                                        .split(',')[0].trim();
    let alias = req.params.alias;
    let currency = req.params.currency;
    try {
        await storeClicks(ip, alias, currency);
        res.json({
            'success': true
        });
    }
    catch(err){
        logger.error(`Warning failed to insert into database`, err);
    }

});


module.exports = router;
