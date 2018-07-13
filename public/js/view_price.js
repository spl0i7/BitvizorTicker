
(function ($) {
    "use strict";
})(jQuery);


Vue.component('exchange', {
    template : '#exchange-template',
    props : {
        data : Object,
        localCurrency : String,
    },
    data: function() {
    },
    mounted : function() {
      console.log(this.data);
    },
    computed : {
        filteredData : function() {
            // TODO : Search???
            return this.data;
        },
        avgCoin : function() {
            0;
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
        changeCoin : function () {
        },
        clicked : function (k) {
            window.open(k.link,'_blank');
        }
    }
});

let vueInstance = new Vue({
    el : '#exchangeContainer',
    data : {
        gridData : [],
    },
    mounted : function() {

        this.lc = localCurrency;
        this.cryptoNames = cryptoNameDB;

        this.populateTable();
        console.log(this.gridData);
        for(c in this.gridData) console.log(c);
    },
    methods : {
        selectCurrency : function(k) {
            this.currencySelected = k;
        },
        populateTable : function(){
            let data = prices;

            this.gridData = Object();

            for(let exchange in data){

                this.gridData[exchange] = Array();


                for (let currency in data[exchange]){

                    this.gridData[exchange].push({
                        buy : Number.parseFloat(data[exchange][currency]['buy']),
                        sell : Number.parseFloat(data[exchange][currency]['sell']),
                        link : data[exchange][currency]['link'],
                        currency : currency,
                        link :  data[exchange][currency]['link']
                    });
                }
            }
        },
        getCryptoName : function (c) {
            return  cryptoNameDB[c];

        },
        formatPrice: function (n) {
            return this.lc + numeral(n).format('0,0.[00]');
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
