(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component("auction-bids", {
    props: ["template", "auction", "auctionId", "userdata"],
    data: function data() {
        return {
            currentBidderList: { 'bidPrice': 1, 'customerMaxBid': 2, 'bidderName': 'test***Kunde1', 'customerId': 3 },
            isInputValid: false,
            maxCustomerBid: null,
            minBid: 1.99
        };
    },
    created: function created() {
        this.$options.template = this.template;
        this.auction = JSON.parse(this.auction);
        this.userdata = JSON.parse(this.userdata);
        this.auctionId = this.auction['id'];
        this.minBid = this.bidderListLastBidPrice + 1;
    },

    methods: {
        addBid: function addBid() {

            if (this.maxCustomerBid > this.bidderListLastCustomerMaxBid) {
                this.currentBidderList.bidPrice = this.bidderListLastCustomerMaxBid + 1;
                this.currentBidderList.customerMaxBid = this.maxCustomerBid;
                this.currentBidderList.bidderName = this.userdata.firstName;
                this.currentBidderList.customerId = this.userdata.id;
                alert('Glückwunsch - Sie sind der Höchstbietende...');
            } else {
                this.currentBidderList.bidPrice = this.maxCustomerBid;
                this.currentBidderList.customerMaxBid = this.bidderListLastCustomerMaxBid;
                this.currentBidderList.bidderName = this.bidderListLastBidderName;
                this.currentBidderList.customerId = this.bidderListLastCustomerId;

                alert('Es gibt leider schon ein höheres Gebot...');
            }

            // alert( 'this.userdata): ' + this.userdata.id + '\n' + '' );
        }
    },
    computed: {
        bidderListLastBidPrice: function bidderListLastBidPrice() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice;
        },
        bidderListLastCustomerMaxBid: function bidderListLastCustomerMaxBid() {
            cache: false;
            return this.auction.bidderList[this.auction.bidderList.length - 1].customerMaxBid;
        },
        bidderListLastBidderName: function bidderListLastBidderName() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].bidderName;
        },
        bidderListLastCustomerId: function bidderListLastCustomerId() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].customerId;
        }
    },
    watch: {
        maxCustomerBid: function maxCustomerBid() {
            alert('angekommen');
            if (this.maxCustomerBid >= this.minBid) {
                this.isInputValid = true;
            } else {
                this.isInputValid = false;
            }
        }
    }
});

},{}],2:[function(require,module,exports){
"use strict";

Vue.component("auction-countdown", {
    ready: function ready() {
        var _this = this;

        window.setInterval(function () {
            _this.now = Math.trunc(new Date().getTime() / 1000);
        }, 1000);
    },

    props: ["template", "deadline", "date", "stop"],
    data: function data() {
        return {
            now: Math.trunc(new Date().getTime() / 1000),
            diff: 0
        };
    },
    created: function created() {
        this.$options.template = this.template;
        this.date = this.deadline;
        /* String to Number ??? */
    },

    methods: {
        twoDigits: function twoDigits(value) {
            if (value.toString().length <= 1) {
                return '0' + value.toString();
            }
            return value.toString();
        }
    },
    computed: {
        seconds: function seconds() {
            return this.twoDigits((this.date - this.now) % 60);
        },
        minutes: function minutes() {
            return this.twoDigits(Math.trunc((this.date - this.now) / 60) % 60);
        },
        hours: function hours() {
            return this.twoDigits(Math.trunc((this.date - this.now) / 60 / 60) % 24);
        },
        days: function days() {
            return this.twoDigits(Math.trunc((this.date - this.now) / 60 / 60 / 24));
        }
    },
    watch: {
        now: function now(value) {
            this.diff = this.date - this.now;
            if (this.diff <= 0 || this.stop) {
                this.diff = 0;
                // Remove interval
                window.clearInterval();
            }
        }
    }
});

},{}],3:[function(require,module,exports){
'use strict';

Vue.filter('twoDigits', function (value) {
    if (value.toString().length <= 1) {
        return '0' + value.toString();
    }
    return value.toString();
});

},{}]},{},[1,2,3])



//# sourceMappingURL=auction-app.js.map
