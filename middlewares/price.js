let mysql = require('../config/mysqldb');
let memoryDatabase = require('../memorydatabase').create();
let logger = require('tracer').colorConsole();

function insertData(mysql, country, currency, sell, buy, exchange) {
    //create table price_history(timestamp datetime, exchange_name varchar(50), currency varchar(5), country varchar(5), buy int, sell int);
    return new Promise((resolve, reject)=> {
        mysql.query({
            sql: 'INSERT INTO `price_history`(`exchange_name`, `currency`, `country`, `sell`, `buy`, `timestamp`) VALUES(?, ?, ?, ? , ? ,NOW())',
            values: [exchange, currency, country, sell, buy]
        }, (err, results, fields) => {
            if (err) reject(err);
            resolve();
        })
    })
}

module.exports = async function (country, exchange, currency, sell, buy) {
    try {
        memoryDatabase[country][exchange][currency]['buy'] = buy;
        memoryDatabase[country][exchange][currency]['sell'] = sell;
        await insertData(mysql, country, currency, sell, buy, exchange);
    }
    catch (e) {
        logger.error('Error');
    }

};