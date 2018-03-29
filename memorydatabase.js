let exchangeConfig = require('./config/exchange');


module.exports = {
    create : function() {
        if(!this.database) {
            let database = {};
            for (c in exchangeConfig) {
                database[c] = {};
                for (let i = 0; i < exchangeConfig[c]['exchanges'].length; i++) {
                    database[c][exchangeConfig[c]['exchanges'][i]['name']] = {};
                    for (let j = 0; j < exchangeConfig[c]['exchanges'][i]['currencies'].length; j++) {
                        database[c][exchangeConfig[c]['exchanges'][i]['name']][exchangeConfig[c]['exchanges'][i]['currencies'][j]] = {};
                        database[c][exchangeConfig[c]['exchanges'][i]['name']][exchangeConfig[c]['exchanges'][i]['currencies'][j]]['buy'] = 0;
                        database[c][exchangeConfig[c]['exchanges'][i]['name']][exchangeConfig[c]['exchanges'][i]['currencies'][j]]['sell'] = 0;
                        database[c][exchangeConfig[c]['exchanges'][i]['name']][exchangeConfig[c]['exchanges'][i]['currencies'][j]]['link'] = exchangeConfig[c]['exchanges'][i]['link'];
                        database[c][exchangeConfig[c]['exchanges'][i]['name']][exchangeConfig[c]['exchanges'][i]['currencies'][j]]['timestamp'] = null;
                        database[c][exchangeConfig[c]['exchanges'][i]['name']][exchangeConfig[c]['exchanges'][i]['currencies'][j]]['24hr_sell'] = 0;
                        database[c][exchangeConfig[c]['exchanges'][i]['name']][exchangeConfig[c]['exchanges'][i]['currencies'][j]]['24hr_buy'] = 0;

                    }

                }
            }

            this.database = database;
        }

        return this.database;


    },
    database : null
};