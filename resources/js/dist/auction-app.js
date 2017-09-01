(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component("auction-bids", {
    // name: "auctionbids",
    props: ["template", "auction", "maxCustomerBid", "isActive"],
    data: function data() {
        return {
            remainingTime: "this.now",
            minBid: 66.22,
            test: this.auctionParse()
        };
    },
    created: function created() {
        this.$options.template = this.template;
    },

    methods: {
        addBid: function addBid() {
            alert('addBid');
        },
        auctionParse: function auctionParse() {
            var auction = JSON.parse(this.auction);
            return auction.bidderList[0].bidderName;
        }
    }
});

},{}],2:[function(require,module,exports){
"use strict";

// let interval = null;
Vue.component("auction-countdown", {
    ready: function ready() {
        var _this = this;

        window.setInterval(function () {
            _this.now = Math.trunc(new Date().getTime() / 1000);
        }, 1000);
    },

    props: ["template", {
        deadline: {
            type: Number,
            coerce: function coerce(str) {
                return Math.trunc(str);
            }
        }
    }],
    data: function data() {
        return {
            now: Math.trunc(new Date().getTime() / 1000)
        };
    },
    created: function created() {
        this.$options.template = this.template;
    },


    computed: {
        seconds: function seconds() {
            return (this.date - this.now) % 60;
        },
        minutes: function minutes() {
            return Math.trunc((this.date - this.now) / 60) % 60;
        },
        hours: function hours() {
            return Math.trunc((this.date - this.now) / 60 / 60) % 24;
        },
        days: function days() {
            return Math.trunc((this.date - this.now) / 60 / 60 / 24);
        }
    } });

// ##########

// Vue.filter( 'twoDigits', (value) => {
//     if ( value.toString().length <= 1 ) {
//         return '0' + value.toString()
//     }
//     return value.toString()
// } )

},{}]},{},[1,2])


// Vue.filter('twoDigits', (value) => {
//     if ( value.toString().length <= 1 ) {
//         return '0'+value.toString()
//     }
//     return value.toString()
// })
//# sourceMappingURL=auction-app.js.map
