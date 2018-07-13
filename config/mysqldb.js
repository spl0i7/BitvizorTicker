let mysql      = require('mysql');
let logger = require('tracer').colorConsole();
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'bitvizor',
    password : 'lolrofl@123',
    database : 'bitvizor_pricetracker'
});


/* create table price_history(timestamp datetime, exchange_name varchar(50), currency varchar(5), buy int, sell int); */


connection.connect(function(err) {
    if (err) {
        logger.error('Error Connecting to MySQL database %j', err);
        logger.error('Fatal Error, exiting');
        process.exit(1);
    }

    logger.info('Connected to MySQL database');
});

module.exports = connection;