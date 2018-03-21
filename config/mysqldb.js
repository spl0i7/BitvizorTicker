let mysql      = require('mysql');
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'ketan',
    password : 'lolrofl@123',
    database : 'coinscour'
});


/*
create table price_cache(exchange varchar(100), coin varchar (20), country varchar(5), sell bigint, buy bigint, timestamp datetime);
 */


connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('Mysql Connected');
});

module.exports = connection;