
(function ($) {
    "use strict";
})(jQuery);

const DATA_URL = "https://api.coinmarketcap.com/v1/ticker/?limit=100";


Vue.component('table-component', {
    template : '#table-template',
    props : {
        data : Array,
        columns: Array,
    },
    filters : {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }

    },
    methods : {
        formatPrice: function (v) {
            return numeral(v).format('0,0.0000')
        },
        formatVol : function (v) {
            return numeral(v).format('0.00 a')
        }
    }
});
let vueInstance = new Vue({
    el : '#tableContainer',
    data : {
        gridColumns : ['name', 'price', 'volume'],
        gridData : [],
    },
    mounted : function() {
        fetch(DATA_URL)
            .then((response)=> {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.json().then((data)=>{
                        this.gridData = data;
                    });
                }
            )
            .catch((err)=> console.log('Fetch Error :-S', err));
    },
    methods : {
    }
});

