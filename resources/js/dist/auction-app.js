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
'use strict';

var interval = null;

Vue.component("auction-countdown", {
    // name: "auctionbids",
    props: ['template', 'deadline', 'stop'],
    data: function data() {
        return {
            now: Math.trunc(new Date().getTime() / 1000),
            date: null,
            diff: 0
        };
    }, created: function created() {
        this.$options.template = this.template;
    },
    mounted: function mounted() {
        var _this = this;

        this.date = Math.trunc(Date.parse(this.deadline.replace(/-/g, "/")) / 1000);
        interval = setInterval(function () {
            _this.now = Math.trunc(new Date().getTime() / 1000);
        }, 1000);
        console.log(interval);
    },

    computed: {
        seconds: function seconds() {
            return Math.trunc(this.diff) % 60;
        },
        minutes: function minutes() {
            return Math.trunc(this.diff / 60) % 60;
        },
        hours: function hours() {
            return Math.trunc(this.diff / 60 / 60) % 24;
        },
        days: function days() {
            return Math.trunc(this.diff / 60 / 60 / 24);
        }
    },
    watch: {
        now: function now(value) {
            this.diff = this.date - this.now;
            if (this.diff <= 0 || this.stop) {
                this.diff = 0;
                // Remove interval
                clearInterval(interval);
            }
        }
    }
});

// ##########

Vue.filter('twoDigits', function (value) {
    if (value.toString().length <= 1) {
        return '0' + value.toString();
    }
    return value.toString();
});

},{}]},{},[1,2])


// Vue.filter('twoDigits', (value) => {
//     if ( value.toString().length <= 1 ) {
//         return '0'+value.toString()
//     }
//     return value.toString()
// })
//# sourceMappingURL=auction-app.js.map
