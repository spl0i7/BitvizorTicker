let sseConnections = require('./middlewares/sse').sseConnections;
let database = require('./database').create();

module.exports = function (country, exchange, currency, sell, buy) {
        database[country][exchange][currency]['buy'] = buy;
        database[country][exchange][currency]['sell'] = sell;
        let currentChConnections = sseConnections[country];
        for (let i = 0; i < currentChConnections.length; i++) {
            currentChConnections[i].sseSend(
                {
                    currency: currency,
                    exchange: exchange,
                    price: database[country][exchange][currency]
                }
            );
        }
};