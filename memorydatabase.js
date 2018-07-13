let exchangeConfig = require('./config/exchange');


module.exports = {
    create : function() {
        if(!this.database) {
            let database = {};
            for (country in exchangeConfig) {
                database[country] = {};
                for (let i = 0; i < exchangeConfig[country]['exchanges'].length; i++) {
                    database[country][exchangeConfig[country]['exchanges'][i]['name']] = {};
                    for (let j = 0; j < exchangeConfig[country]['exchanges'][i]['currencies'].length; j++) {
                        database[country][exchangeConfig[country]['exchanges'][i]['name']]
                            [exchangeConfig[country]['exchanges'][i]['currencies'][j]] = {};
                        database[country][exchangeConfig[country]['exchanges'][i]['name']]
                            [exchangeConfig[country]['exchanges'][i]['currencies'][j]]['buy'] = 0;
                        database[country][exchangeConfig[country]['exchanges'][i]['name']]
                            [exchangeConfig[country]['exchanges'][i]['currencies'][j]]['sell'] = 0;
                        database[country][exchangeConfig[country]['exchanges'][i]['name']]
                            [exchangeConfig[country]['exchanges'][i]['currencies'][j]]['link'] = exchangeConfig[country]['exchanges'][i]['link'];
                    }
                }
            }

            this.database = database;
        }
        return this.database;
    },
    database : null
};