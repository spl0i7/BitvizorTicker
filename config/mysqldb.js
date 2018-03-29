let mysql      = require('mysql');
let logger = require('tracer').colorConsole();
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'ketan',
    password : 'lolrofl@123',
    database : 'coinscour'
});


/*
create table price_cache(exchange varchar(100), currency varchar (20), country varchar(5), sell bigint, buy bigint, timestamp datetime);
create table click_stats(ip varchar(20) not null, timestamp datetime not null, exchange varchar(50) not null, currency varchar(5) not null);
//datatypes can be improved
 */


connection.connect(function(err) {
    if (err) {
        logger.error('Error Connecting to MySQL database %j', err);
        logger.error('Fatal Error, exiting');
        process.exit(1);
    }

    logger.info('Connected to MySQL database');
});

module.exports = connection;