
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
        countryName : String,
        countryNames : Object
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
            sortOrders: sortOrders,
            selectedCurrency : '',
            selectedCountry : '',
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
            let length = 0;
            for(let i=0 ; i < this.filteredData.length; i++){
                if(!isNaN(this.filteredData[i]['buy']) && !isNaN(this.filteredData[i]['sell'])) {
                    prices['buy'] += Number.parseFloat(this.filteredData[i]['buy']);
                    prices['sell'] += Number.parseFloat(this.filteredData[i]['sell']);
                    length++;
                }
            }
            prices['buy'] = prices['buy'] / length;
            prices['sell'] = prices['sell'] / length;
            return prices;
        }
    },
    filters : {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },

    methods: {
        formatPrice: function (n) {
            return numeral(n).format('0,0.[00]');
        },
        sortBy: function (key) {
            this.sortKey = key;
            this.sortOrders[key] = this.sortOrders[key] * -1
        },
        changeCountry: function(){
            bus.$emit('changeCountry', this.selectedCountry);
        },
        changeCoin : function () {
            console.log('Changed', this.selectedCurrency);
            this.filterCoin = this.selectedCurrency;
            setCookie("filterCoin", this.selectedCurrency, 365);
        },
        clicked : function(k) {
          fetch(`/clicked/${k.alias}/${k.currency}`).
              then(a=> window.location = k.link);
        }
    }
});
let vueInstance = new Vue({
    el : '#tableContainer',
    data : {
        gridColumns : ['exchange', 'buy', 'sell' ],
        gridData : [],
        currencies : [],
        countries : [],
        localCurrency: '$' ,
        currencySelected : 'ALL',
        sse : null,
        usdRate : 0.0,
        countryName : '',
        countryNames : {},
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

                        this.countryName = info['countryName'];
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
                        this.countryName = handshake['countryName'];
                        this.countries = handshake['countries'];
                        this.countryNames = handshake['countryNames'];
                        this.countries.sort();
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
                                link : data[exchange][currency]['link'],
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


Vue.component('avg-table-component', {
    template : '#avg-table-template',
    props : {
        data : Array,
        columns: Array,
        title : String
    },
    filters : {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }

    },
    methods : {
        formatPrice: function (v) {
            return numeral(v).format('0,0.[00]');
        },
    }
});

let avgVueInstance = new Vue({
    el : '#avgtableContainer',
    data : {
        gridColumns : ['country', 'buy', 'sell'],
        gridData : [],
    },
    mounted : function() {
        fetch(HANDSHAKE_URL + 'avg')
            .then((response)=> {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.json().then((data)=>{
                        this.gridData = data;
                        for(key in this.gridData) {
                            this.gridData[key].sort((a, b) => a['country'].localeCompare(b['country']));
                        }

                    });
                }
            )
            .catch((err)=> console.log('Fetch Error :-S', err));
    },
    methods : {
    }
});



Vue.component('news-component', {
    template : '#news-template',
    props : {
        data : Array,
        title : String
    },
    methods : {
        formatTime : function (datestr) {
            let articleDate = Date.parse(datestr);
            let currentDate = new Date();
            return Math.round(Math.abs((currentDate.getTime() - articleDate)/(24*60*60*1000)));
        }
    }
});

let newsVueInstance = new Vue({
    el : '#newsContainer',
    data : {
        gridData : [],
    },
    mounted : function() {
        let parser = new RSSParser();
        parser.parseURL('https://cors-anywhere.herokuapp.com/' + 'http://news.bitvizor.com/feed/', (err, feed)=> {
            this.gridData = feed.items;
            this.gridData = this.gridData.slice(0, 6);
        });
    },
    methods : {

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

