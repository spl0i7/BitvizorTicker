
(function ($) {
    "use strict";
})(jQuery);

const SSE_URL = "/stream/IN";
Vue.component('table-component', {
    template : '#table-template',
    props : {
        data : Array,
        columns: Array,
        currencies : Array,
    },
    data: function() {
        let sortOrders = {};
        this.columns.forEach(function(k){
            sortOrders[k] = 1;
        });
        return {
            filterCoin : 'ALL',
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed : {
        filteredData : function() {
            let data = this.data;
            let sortKey = this.sortKey;
            let order = this.sortOrders[sortKey] || 1;
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey];
                    b = b[sortKey];
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                });
            }
            if(this.filterCoin !== 'ALL') {
                let filterKey = this.filterCoin && this.filterCoin.toLowerCase();
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    });
                });

            }
            return data;
        }
    },
    filters : {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key;
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
});
let vueInstance = new Vue({
    el : '#tableContainer',
    data : {
        gridColumns : ['exchange', 'buy', 'sell', 'last checked'],
        gridData : [],
        currencies : [],
        currencySelected : 'ALL'
    },
    mounted : function() {
        let gridData = this.gridData;
        this.currencies.push('ALL');
        let sse = new EventSource(SSE_URL);
        sse.onopen = ()=> sse.onmessage = (e) => {
            let data = JSON.parse(e.data);
            let currentExchange = data['exchange'];
            /*
            *
            *
            * {"ZebPay":{"eth":{"buy":0,"sell":0},"btc":{"buy":0,"sell":0}}
            * */
            if(!currentExchange) {
                //gridData = [];
                for(let exchange in data){
                    for (let currency in data[exchange]){

                        let flag = true;
                        for(let i = 0; i < this.currencies.length; i++){
                            if(this.currencies[i] === currency.toUpperCase()) {
                                flag = false;
                                break;
                            }
                        }
                        if(flag) this.currencies.push(currency.toUpperCase());



                        gridData.push({
                            alias: exchange,
                            exchange : `${exchange} (${currency.toUpperCase()})`,
                            buy : data[exchange][currency]['buy'],
                            sell : data[exchange][currency]['sell'],
                            lastChecked : new Date(),
                            currency : currency
                        })
                    }
                }
            }
            else {
                for(let i = 0; i < gridData.length; i++) {
                    if(gridData[i]['alias'] === currentExchange && gridData[i]['currency'] === data['currency'] ) {
                        console.log('match');
                        gridData[i]['buy'] = data['price']['buy'];
                        gridData[i]['sell'] = data['price']['sell'];
                        gridData[i]['lastChecked'] = new Date();
                        break;
                    }
                }

            }

        }
    },
    methods : {
        selectCurrency : function(k) {
            this.currencySelected = k;
        }
    }
});

//
// let ws = new WebSocket(WS_URL);
// ws.onopen = ()=> ws.onmessage = priceHandler ;
//
// function priceHandler(e) {
//     let data = JSON.parse(e.data);
//     let currentExchange = COIN_MAP[data['exchange']];
//     let children = $(currentExchange).children();
//     $(children[1]).text(CURRENCY + ' ' + data['price']['buy']);
//     $(children[2]).text(CURRENCY + ' ' + data['price']['sell']);
//     $(children[3]).text(new Date().toLocaleTimeString());
// }

