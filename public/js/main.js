
(function ($) {
    "use strict";
})(jQuery);

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const SSE_URL = "/stream/";
const HANDSHAKE_URL = "/handshake/";

let bus = new Vue();

Vue.component('table-component', {
    template : '#table-template',
    props : {
        data : Array,
        columns: Array,
        currencies : Array,
        localCurrency : String,
        countries : Array,
        usdRate : Number,
    },
    data: function() {
        let sortOrders = {};
        this.columns.forEach(function(k){
            sortOrders[k] = 1;
        });
        return {
            amount : 1.00000,
            filterCoin : getCookie('filterCoin')||'ALL',
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
        },
        avgCoin : function() {
            let prices = {
                buy : 0,
                sell: 0
            };
            for(let i=0 ; i < this.filteredData.length; i++){
                if(!isNaN(this.filteredData[i]['buy']) && !isNaN(this.filteredData[i]['sell'])) {
                    prices['buy'] += Number.parseFloat(this.filteredData[i]['buy']);
                    prices['sell'] += Number.parseFloat(this.filteredData[i]['sell']);
                }
            }
            prices['buy'] = prices['buy'] / this.filteredData.length;
            prices['sell'] = prices['sell'] / this.filteredData.length;
            return prices;
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
        },
        changeCountry: function(key){
            bus.$emit('changeCountry', key);
        },
        changeCoin : function (k) {
            this.filterCoin = k;
            setCookie("filterCoin", k, 365);
        }
    }
});
let vueInstance = new Vue({
    el : '#tableContainer',
    data : {
        gridColumns : ['exchange', 'buy', 'sell'],
        gridData : [],
        currencies : [],
        countries : [],
        localCurrency: '$' ,
        currencySelected : 'ALL',
        sse : null,
        usdRate : 0.0,
    },
    mounted : function() {
        bus.$on('changeCountry', (key)=>{
            fetch(`${HANDSHAKE_URL}currency/${key}`)
                .then((res)=>{
                    if (res.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    res.json().then((info)=>{

                        this.localCurrency = info['localCurrency'];
                        this.usdRate = info['USDRate'];
                        this.connectAPI(key);
                    });
                })
                .catch((err)=> console.log('Fetch Error :-S', err));
        });
        this.currencies.push('ALL');
        fetch(HANDSHAKE_URL)
            .then((response)=> {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.json().then((handshake)=>{
                        this.countries = handshake['countries'];
                        this.localCurrency = handshake['localCurrency'];
                        this.usdRate = handshake['USDRate'];
                        this.connectAPI(handshake['country']);
                    });
                }
            )
            .catch((err)=> console.log('Fetch Error :-S', err));
    },
    methods : {
        selectCurrency : function(k) {
            this.currencySelected = k;
        },
        connectAPI : function(k){
            if(this.sse !== null) {
                this.sse.close();
            }
            this.sse = new EventSource(SSE_URL + k);
            this.sse.onopen = ()=> this.sse.onmessage = (e) => {
                let data = JSON.parse(e.data);

                let currentExchange = data['exchange'];
                /*
                *
                *
                * {"ZebPay":{"eth":{"buy":0,"sell":0},"btc":{"buy":0,"sell":0}}
                * */
                if(!currentExchange) {

                    this.gridData = [];
                    for(let exchange in data){
                        for (let currency in data[exchange]){
                            /* must not include 24 hr data as a currency */
                            let flag = true;
                            for(let i = 0; i < this.currencies.length; i++){
                                if(this.currencies[i] === currency.toUpperCase()) {
                                    flag = false;
                                    break;
                                }
                            }
                            if(flag) this.currencies.push(currency.toUpperCase());
                            this.gridData.push({
                                alias: exchange,
                                exchange : `${exchange} (${currency.toUpperCase()})`,
                                buy : Number.parseFloat(data[exchange][currency]['buy']),
                                sell : Number.parseFloat(data[exchange][currency]['sell']),
                                currency : currency,
                                '24hr_buy' : Number.parseFloat(data[exchange][currency]['24hr_buy']),
                                '24hr_sell' : Number.parseFloat(data[exchange][currency]['24hr_sell']),
                            })
                        }
                    }
                }
                else {
                    for(let i = 0; i < this.gridData.length; i++) {
                        if(this.gridData[i]['alias'] === currentExchange && this.gridData[i]['currency'] === data['currency'] ) {
                            console.log('match');
                            this.gridData[i]['buy'] = Number.parseFloat(data['price']['buy']);
                            this.gridData[i]['sell'] = Number.parseFloat(data['price']['sell']);
                            break;
                        }
                    }

                }

            }

        },

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

