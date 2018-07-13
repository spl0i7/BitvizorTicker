
(function ($) {
    "use strict";
})(jQuery);


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
            filterCoin : 'ALL',
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

            // change country
        },
        changeCoin : function () {
            console.log('Changed', this.selectedCurrency);
            this.filterCoin = this.selectedCurrency;
        },
        clicked : function (k) {
            window.open(k.link,'_blank');
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
        countryName : '',
        countryNames : {},
    },
    mounted : function() {
        this.currencies.push('ALL');
        this.countryName = '';
        this.countries = [];
        this.countryNames = [];
        this.countries.sort();
        this.localCurrency = localCurrency;
        this.populateTable();

    },
    methods : {
        selectCurrency : function(k) {
            this.currencySelected = k;
        },
        populateTable : function(){
            let data = prices;

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
                    })
                }
            }
        }
    },
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
        //
        //
        // this.gridData = data;
        // for(key in this.gridData) {
        //     this.gridData[key].sort((a, b) => a['country'].localeCompare(b['country']));
        // }

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
        // let parser = new RSSParser();
        // parser.parseURL('/news/feed/', (err, feed)=> {
        //     this.gridData = feed.items;
        //     this.gridData = this.gridData.slice(0, 6);
        // });
    },
    methods : {

    }
});