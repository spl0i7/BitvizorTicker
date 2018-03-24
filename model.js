let sseConnections = require('./middlewares/sse').sseConnections;
let mysql = require('./config/mysqldb');
let memoryDatabase = require('./memorydatabase').create();

const TABLE_LIMIT = 48;
const RATE = 1000 * 60 * 30;


function insertData(mysql, country, currency, sell, buy, exchange) {
    mysql.query({

        sql: 'INSERT INTO `price_cache`(`exchange`, `currency`, `country`, `sell`, `buy`, `timestamp`) VALUES(?, ?, ?, ? , ? ,NOW())',
        values: [exchange, currency, country, sell, buy]
    });
}
function pushData(country, currency, exchange){

    let disconnectedsockIndex = [];

    let currentChConnections = sseConnections[country];
    for (let i = 0; i < currentChConnections.length; i++) {

        if(currentChConnections[i].socket.readyState !== 'open') {
            disconnectedsockIndex.push(i);
        }

        currentChConnections[i].sseSend(
            {
                currency: currency,
                exchange: exchange,
                price: memoryDatabase[country][exchange][currency],
            }
        );
    }

    for(let i = 0; i < disconnectedsockIndex.length; i++){
        sseConnections[country].splice(disconnectedsockIndex[i], 1);
    }




}

module.exports = function (country, exchange, currency, sell, buy) {
        memoryDatabase[country][exchange][currency]['buy'] = buy;
        memoryDatabase[country][exchange][currency]['sell'] = sell;

        mysql.query({
            sql : 'SELECT timestamp AS time from `price_cache` where `country` = ? AND `exchange`  = ? AND `currency` = ? ORDER BY timestamp DESC',
            timeout : 4000,
            values : [country, exchange, currency]
        }, (err, results, fields)=>{
            if(results.length === 0) {

                insertData(mysql, country, currency, sell, buy, exchange);

            }
            else if(Date.now() - results[0].time > RATE && results.length <= TABLE_LIMIT){

                insertData(mysql, country, currency, sell, buy, exchange);
            }
            else if(results.length >= TABLE_LIMIT + 1) {
                mysql.query({
                    sql : 'DELETE FROM `price_cache` ORDER BY timestamp ASC LIMIT ?',
                    values: [results.length - (TABLE_LIMIT + 1) + 1]
                }, (err, ressults, fields)=>{

                    insertData(mysql, country, currency, sell, buy, exchange);

                });
            }
        });

        if(!memoryDatabase[country][exchange][currency]['timestamp'] ||
            Date.now() - memoryDatabase[country][exchange][currency]['timestamp'] > RATE ) {
            memoryDatabase[country][exchange][currency]['timestamp'] = Date.now();
            mysql.query({
                sql : 'SELECT buy,sell from `price_cache` where `country` = ? AND `exchange`  = ? AND `currency` = ? ORDER BY timestamp DESC LIMIT 1',
                timeout : 4000,
                values : [country, exchange, currency]
            }, (err, results, fields)=> {
                if (!results || results.length === 0) {
                    memoryDatabase[country][exchange][currency]['24hr_sell'] = sell;
                    memoryDatabase[country][exchange][currency]['24hr_buy'] = buy;
                }
                else {
                    memoryDatabase[country][exchange][currency]['24hr_buy']= results[0]['buy'];
                    memoryDatabase[country][exchange][currency]['24hr_sell']= results[0]['sell'];
                }
            });
        }



        pushData(country,currency,exchange)
};