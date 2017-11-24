(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// const ApiService = require( "services/ApiService" );
// const NotificationService = require( "services/NotificationService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

Vue.component("visitor-counter", {
    props: ["template", "numberOfVisitors"],
    data: function data() {
        return {
            ones: 0,
            tens: 0,
            hundreds: 0,
            thousands: 0
        };
    },
    created: function created() {
        this.$options.template = this.template;
    },
    compiled: function compiled() {
        this.numberOfVisitors = parseInt(this.numberOfVisitors);
    },
    ready: function ready() {

        this.ones = this.numberOfVisitors % 10;
        this.tens = parseInt(this.numberOfVisitors / 10) % 10;
        this.hundreds = parseInt(this.numberOfVisitors / 10 / 10) % 10;
        this.thousands = parseInt(this.numberOfVisitors / 10 / 10 / 10) % 10;
    },

    methods: {
        // twoDigits(value) {
        //     if ( value.toString().length <= 1 ) {
        //         return '0' + value.toString()
        //     }
        //     return value.toString()
        // }

        // getTest() {
        //     ApiService.get( "/api/auction/" + this.auctionid )
        //         .done( auction => {
        //             this.auction = auction;
        //             this.$children['AuctionBids'].auction = this.auction;
        //         } )
        //         .fail( () => {
        //                    alert( 'Upps - ein Fehler bei biddersFromServer ??!!' );
        //                }
        //         )
        // }
    }
});

},{}],2:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var NotificationService = require("services/NotificationService");
var AuctionConstants = require("constants/AuctionConstants");
// const ModalService        = require("services/ModalService");

// const ResourceService     = require("services/ResourceService");

var NOTIFY_TIME = 10000;

Vue.component("auction-bids", {
    props: ["template", "userdata", "auction", "minbid", "auctionEnd", "item", "deadline"],
    data: function data() {
        return {
            isInputValid: false,
            maxCustomerBid: null
        };
    },
    created: function created() {
        this.$options.template = this.template;
    },
    compiled: function compiled() {
        this.userdata = JSON.parse(this.userdata);

        this.item = JSON.parse(this.item);

        this.auction = JSON.parse(this.auction);
        this.deadline = parseInt(this.auction.expiryDate);
        this.minbid = this.toFloatTwoDecimal(this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice + 1);
    },
    ready: function ready() {
        // tense "present" und Customer loggedIn ??
        if (this.auction.tense == AuctionConstants.PRESENT && this.userdata != null) {
            // Auswertung für Bieter in Bidderlist bzw. auch für den gerade in Session gespeicherten User... ???!!
            if (this.hasLoggedInUserBiddenYet() || sessionStorage.getItem("currentBidder") == this.userdata.id) {
                this.liveEvaluateAndNotify();
            }
        };

        // this.bankInfoModal = ModalService.findModal(this.$els.bankInfoModal);
    },

    methods: {
        confirmBid: function confirmBid() {
            var content = "<p>test</p>";

            // alert('ok - hier');
            // var $modal     = $( this.$els.auctionBidConfirmModal );
            // var $modalBody = $( this.$els.auctionBidConfirmModalContent );
            //
            // $modalBody.html( "<p>test</p>" );
            //
            $("#auctionBidConfirmModal").modal("show");

            $("#auctionBidConfirmModalContent").html(content);
        },
        addBidTest: function addBidTest() {
            alert('addBidTest');
        },
        addBid: function addBid() {
            var _this = this;

            ApiService.get("/auctions/calctime/" + this.auction.startDate + "/" + this.auction.expiryDate).done(function (tenseFromServer) {
                var tense = tenseFromServer;
                // Absicherung mit Server Time, dass Auktion noch 'present' ist

                if (tense == AuctionConstants.PRESENT) {
                    ApiService.get("/auctions/lastbidprice/" + _this.auction.id).done(function (lastBidPrice) {
                        // ist es ein gültiges Gebot (höher als letztes Gebot) ?
                        if (_this.maxCustomerBid > _this.toFloatTwoDecimal(lastBidPrice)) {

                            var pos = _this.userdata.email.indexOf("@");
                            var newBidderName = _this.userdata.email.slice(0, 2) + " *** " + _this.userdata.email.slice(pos - 2, pos);

                            var currentBid = {
                                customerMaxBid: _this.toFloatTwoDecimal(_this.maxCustomerBid),
                                bidderName: newBidderName,
                                customerId: parseInt(_this.userdata.id)
                            };

                            // super Time Tunnel
                            sessionStorage.setItem("currentBidder", _this.userdata.id);

                            ApiService.put("/auctions/bidderlist/" + _this.auction.id, JSON.stringify(currentBid), { contentType: "application/json" }).then(function (response) {
                                if (response.indexOf("Fehler") >= 0) {
                                    NotificationService.error(response).close;
                                } else {
                                    NotificationService.success("<h3>STATUS:</h3><hr>" + TranslationsAo.Template.successBid).close;
                                }
                                _this.reload(2000);
                            }, function (error) {
                                NotificationService.error("error31: " + error.toString()).closeAfter(NOTIFY_TIME);
                            });
                        }
                        // es gibt inzwischen schon ein höheres Gebot
                        else {
                                // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                NotificationService.warn("<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionIsHigherMaxBid).close;
                                _this.reload(5000);
                            }
                    }).fail(function () {
                        NotificationService.error("Upps - ein Fehler bei auctionbidprice ??!!").close;
                    });
                } else {
                    // ToDO Modal mit Time 5sec
                    _this.printClockWarn();
                    _this.afterAuctionWithServerTensePast();
                }
            }).fail(function () {
                NotificationService.error("Upps - ein Fehler bei der Zeitabfrage ??!!").close;
            });
        },
        liveEvaluateAndNotify: function liveEvaluateAndNotify() {
            if (this.hasLoggedInUserTheLastBid()) {
                // vorletztes Gebot auch von mir ? - entweder mein MaxGebot geändert, oder unterlegenes Gebot... ?
                if (this.auction.bidderList[this.auction.bidderList.length - 2].customerId == this.userdata.id) {
                    switch (this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus.toString()) {
                        case AuctionConstants.OWN_BID_CHANGED:
                            {
                                NotificationService.info("<h3>" + TranslationsAo.Template.auctionlastAction + "</h3><hr>" + TranslationsAo.Template.auctionChangedOwnMaxBid).closeAfter(NOTIFY_TIME);
                                break;
                            }
                        case AuctionConstants.LOWER_BID:
                            {
                                // "<i class=\"fa fa-check-circle p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                NotificationService.success("<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionLowerMaxBid).closeAfter(NOTIFY_TIME);
                                break;
                            }
                    }
                } else {
                    // bidStatus von letzter bid ???
                    switch (this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus.toString()) {
                        case AuctionConstants.OWN_BID_CHANGED:
                            {
                                // "<i class=\"fa fa-info-circle p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                NotificationService.info("<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionChangedOwnMaxBid).closeAfter(NOTIFY_TIME);
                                break;
                            }
                        case AuctionConstants.HIGHEST_BID:
                            {
                                NotificationService.success(
                                // "<i class=\"fa fa-check-circle-o p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionYouHaveHighestBid).closeAfter(NOTIFY_TIME);
                                break;
                            }
                        case AuctionConstants.LOWER_BID:
                            {
                                // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                NotificationService.warn("<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionIsHigherMaxBid).closeAfter(NOTIFY_TIME);
                                break;
                            }
                    }
                }
            } else {
                NotificationService.warn(
                // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionIsHigherMaxBid).closeAfter(NOTIFY_TIME);
            }
            /**/
            sessionStorage.removeItem("currentBidder");
        },
        hasLoggedInUserBiddenYet: function hasLoggedInUserBiddenYet() {
            // return true if LoggedInUser in BidderList (foreach... break wenn gefunden)
            for (var i = this.auction.bidderList.length; --i > 0;) {
                if (this.userdata.id == this.auction.bidderList[i].customerId) {
                    return true;
                }
            }
            return false;
        },
        hasLoggedInUserTheLastBid: function hasLoggedInUserTheLastBid() {
            // return true if lastBid.CustomerId == loggedInCustomerID
            if (this.auction.bidderList[this.auction.bidderList.length - 1].customerId == this.userdata.id) {
                return true;
            }
            return false;
        },
        toFloatTwoDecimal: function toFloatTwoDecimal(value) {
            return Math.round(parseFloat(value) * 100) / 100.0;
        },
        auctionend: function auctionend() {
            var startD = Math.trunc(new Date().getTime() / 1000);

            startD = startD - 24 * 60 * 60 + 10;
            var Bidtest = {
                startDate: startD,
                startHour: 16,
                startMinute: 45,
                auctionDuration: 1,
                startPrice: this.minbid - 2
            };
            var url = "/api/auction/" + this.auction.id;

            ApiService.put(url, JSON.stringify(Bidtest), { contentType: "application/json" }).done(function (auction) {
                // alert( "ok" );
            }).fail(function () {
                NotificationService.error("Upps - ein Fehler beim auctionend ??!!").close;
            });
        },
        afterAuctionWithFrontendTime: function afterAuctionWithFrontendTime(counter, tense) {
            var _this2 = this;

            if (counter == 5) {
                // ToDO Modal mit Time 5sec
                this.printClockWarn();
                // Todo: Wiederholung unterbinden !!
                this.reload(10);
            } else {
                // im Frontend-Browser abgelaufen, aber auf dem Server noch nicht
                ApiService.get("/auctions/calctime/" + this.auction.startDate + "/" + this.auction.expiryDate).done(function (tensefromServer) {
                    tense = tensefromServer;

                    if (tense == AuctionConstants.PAST) {
                        _this2.reload(100);
                        // this.afterAuctionWithServerTensePast();
                    } else {
                        counter++;
                        if (counter > 2) {
                            NotificationService.warn("<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionMatchServerTime).closeAfter(3000);
                        }
                        setTimeout(function () {
                            _this2.afterAuctionWithFrontendTime(counter, tense);
                        }, counter * 1000 + 2000);
                    }
                }).fail(function () {
                    NotificationService.error("Ein Fehler in afterAuctionWithFrontendTime  ??!!").close;
                });
            }
        },
        afterAuctionWithServerTensePast: function afterAuctionWithServerTensePast() {
            var _this3 = this;

            if (this.userdata != null) {
                ApiService.get("/auctions/lastentry/" + this.auction.id).done(function (lastEntry) {

                    var bidderListLastEntry = lastEntry;

                    // Gewinner eingeloggt?
                    if (_this3.userdata.id == bidderListLastEntry.customerId) {
                        // Artikel in den Warenkorb
                        var url = "/auction_to_basket?number=" + _this3.item.variation.id + "&auctionid=" + _this3.auction.id;

                        ApiService.post(url).done(function (response) {

                            var result = JSON.parse(response);

                            if (result == _this3.item.variation.id) {
                                sessionStorage.setItem("basketItem", _this3.auction.itemId);
                                _this3.reload(10);
                            } else {
                                NotificationService.error("Ein Fehler ist aufgetreten:\nBitte sehen Sie in Ihre Emails bzw. wenden Sie sich an unseren Kundendienst (s.Kontakt auf dieser Website)").close;
                            }
                        }).fail(function () {
                            alert("Oops - Fehler bei Auction Auswertung 2 ??!!");
                        });
                    }
                    // Nichtgewinner angemeldet...
                    else {
                            _this3.reload(10);
                        }
                }).fail(function () {
                    alert("Fehler bei After Auction 1 ??!!");
                });
            }
            // niemand angemeldet...
            else {
                    this.reload(10);
                }
        },
        reload: function reload(timeout) {
            setTimeout(function () {
                location.reload();
            }, timeout);
        },
        printClockWarn: function printClockWarn() {
            NotificationService.error("Bitte überprüfen Sie ggf. die Uhrzeit Ihres Computers!<br>" + "(Diese sollte in den System-Einstellungen auf automatisch (über das Internet) eingestellt werden)<br>" + "Die Serverzeit für diese Auktion unterscheidet sich von der dieses Computers!").close;
        }
    },
    watch: {
        maxCustomerBid: function maxCustomerBid() {

            if (this.maxCustomerBid > 0 && this.userdata == null) {
                NotificationService.error(TranslationsAo.Template.auctionPleaseLogin).closeAfter(5000);
                this.isInputValid = false;
            }
            if (this.maxCustomerBid >= this.minbid && this.userdata != null) {
                this.isInputValid = true;
            } else {
                this.isInputValid = false;
            }
        },
        auctionEnd: function auctionEnd() {
            if (this.auctionEnd) {
                var tense = AuctionConstants.PRESENT;
                var counter = 0;

                this.afterAuctionWithFrontendTime(counter, tense);
            }
        }
    }
});

},{"constants/AuctionConstants":7,"services/ApiService":8,"services/NotificationService":9}],3:[function(require,module,exports){
"use strict";

// const ApiService = require("services/ApiService");
var NotificationService = require("services/NotificationService");
// const AuctionConstants = require("constants/AuctionConstants");
var NOTIFY_TIME = 10000;

Vue.component("auction-end", {
    props: ["template", "userdata", "auction", "isWinnerLoggedIn"],
    data: function data() {
        return {};
    },
    created: function created() {
        this.$options.template = this.template;
    },
    compiled: function compiled() {
        this.userdata = JSON.parse(this.userdata);
        this.auction = JSON.parse(this.auction);
    },
    ready: function ready() {
        // User loggedIn ??
        if (this.userdata !== null) {
            this.evaluateAndNotifyAfterAuction();
        }
    },

    methods: {
        evaluateAndNotifyAfterAuction: function evaluateAndNotifyAfterAuction() {

            // Gewinner eingeloggt ??
            if (this.auction.bidderList[this.auction.bidderList.length - 1].customerId === this.userdata.id) {
                // this.isWinnerLoggedIn = true;
                NotificationService.success(TranslationsAo.Template.auctionEndCongratulations).closeAfter(NOTIFY_TIME);
            }
            // Anderer User eingeloggt
            else {
                    // this.isWinnerLoggedIn = false;
                    // ist der eingeloggte User in BidderList
                    if (this.hasLoggedInUserBiddenYet() === true) {
                        NotificationService.error("<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionUnfortunalyOutbid).closeAfter(NOTIFY_TIME);
                    }
                    // nein
                    else {
                            NotificationService.info("<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionNotBid).closeAfter(NOTIFY_TIME);
                        }
                    sessionStorage.removeItem("basketItem");
                }
        },
        hasLoggedInUserBiddenYet: function hasLoggedInUserBiddenYet() {
            // return true if LoggedInUser in BidderList (foreach... break wenn gefunden)
            for (var i = this.auction.bidderList.length; --i > 0;) {
                // console.log( 'this.userdata.id: ' + this.userdata.id + i + 'customerid' + this.auction.bidderList[i].customerId );
                if (this.userdata.id === this.auction.bidderList[i].customerId) {
                    return true;
                }
            }
            return false;
        }
    }
});

},{"services/NotificationService":9}],4:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var NotificationService = require("services/NotificationService");

Vue.component("auction-show-bidderlist", {

    props: {
        template: String,
        auctionid: String
    },

    data: function data() {
        return {
            bidderList: [],
            bidders: 0
        };
    },
    created: function created() {
        this.$options.template = this.template;
        this.auctionid = parseInt(this.auctionid);
    },
    ready: function ready() {
        this.getBidderList();
    },

    methods: {
        getBidderList: function getBidderList() {
            var _this = this;

            ApiService.get("/auctions/bidderlist/" + this.auctionid).done(function (biddersFromServer) {

                // const bidderData     = this.getBidderList();
                var differentBidders = [];

                _this.bidderList = [];

                for (var i = biddersFromServer.length; --i >= 0;) {
                    var bidView = {};

                    bidView.bidderName = biddersFromServer[i].bidderName;
                    bidView.bidPrice = biddersFromServer[i].bidPrice;
                    bidView.bidStatus = biddersFromServer[i].bidStatus;
                    bidView.bidTimeStamp = biddersFromServer[i].bidTimeStamp * 1000;

                    _this.bidderList.push(bidView);

                    var currentUserId = biddersFromServer[i].customerId;

                    if (differentBidders.indexOf(currentUserId) < 0) {
                        differentBidders.push(currentUserId);
                    }
                }
                _this.bidders = differentBidders.length - 1;
            }).fail(function () {
                NotificationService.error("Upps - ein Fehler bei biddersFromServer ??!!").close;
            });
        }
    }
});

},{"services/ApiService":8,"services/NotificationService":9}],5:[function(require,module,exports){
"use strict";

// import ExceptionMap from "exceptions/ExceptionMap";
//
var NotificationService = require("services/NotificationService");

Vue.component("notifications-plugin-auction", {

    props: ["initialNotifications", "template"],

    data: function data() {
        return {
            notifications: []
        };
    },

    created: function created() {
        this.$options.template = this.template;
    },

    ready: function ready() {
        var self = this;

        NotificationService.listen(function (notifications) {
            self.$set("notifications", notifications);
        });

        self.showInitialNotifications();
    },

    methods: {
        /**
         * Dissmiss the notification
         * @param notification
         */
        dismiss: function dismiss(notification) {
            NotificationService.getNotifications().remove(notification);
        },

        /**
         * show initial notifications from server
         */
        showInitialNotifications: function showInitialNotifications() {
            for (var key in this.initialNotifications) {
                // set default type top 'log'
                var type = this.initialNotifications[key].type || "log";
                var message = this.initialNotifications[key].message;
                var messageCode = this.initialNotifications[key].code;

                if (messageCode > 0) {
                    message = Translations.Template[ExceptionMap.get(messageCode.toString())];
                }

                // type cannot be undefined
                if (message) {
                    if (NotificationService[type] && typeof NotificationService[type] === "function") {
                        NotificationService[type](message);
                    } else {
                        // unkown type
                        NotificationService.log(message);
                    }
                }
            }
        }
    }
});

},{"services/NotificationService":9}],6:[function(require,module,exports){
"use strict";

Vue.component("auction-countdown", {
    props: ["template", "deadline", "timer", "now", "diff"],
    data: function data() {
        return {};
    },
    created: function created() {
        this.$options.template = this.template;
        // this.deadline          = parseInt(this.deadline);
        this.now = Math.trunc(new Date().getTime() / 1000);
        this.diff = 0;
    },
    ready: function ready() {
        var _this = this;

        this.timer = window.setInterval(function () {
            _this.Timer();
        }, 1000);
    },

    methods: {
        Timer: function Timer() {
            this.now = Math.trunc(new Date().getTime() / 1000);
        },
        twoDigits: function twoDigits(value) {
            if (value.toString().length <= 1) {
                return "0" + value.toString();
            }
            return value.toString();
        }
    },
    computed: {
        seconds: function seconds() {
            return this.twoDigits((this.deadline - this.now) % 60);
        },
        minutes: function minutes() {
            return this.twoDigits(Math.trunc((this.deadline - this.now) / 60) % 60);
        },
        hours: function hours() {
            return this.twoDigits(Math.trunc((this.deadline - this.now) / 60 / 60) % 24);
        },
        days: function days() {
            return this.twoDigits(Math.trunc((this.deadline - this.now) / 60 / 60 / 24));
        }
    },
    watch: {
        now: function now(value) {
            if (this.deadline > this.now) {
                this.diff = this.deadline - this.now;
            } else {
                this.diff = 0;
                this.$parent.auctionEnd = true;
                window.clearInterval(this.timer);
            }
        }
    }
});

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuctionConstants = function AuctionConstants() {
        _classCallCheck(this, AuctionConstants);
};

// bidStatus


var OWN_BID_CHANGED = exports.OWN_BID_CHANGED = "hat eigenes Max-Gebot geändert";
var HIGHEST_BID = exports.HIGHEST_BID = "hat höchstes Gebot abgegeben";
var LOWER_BID = exports.LOWER_BID = "nach neuem, aber geringerem Max-Gebot";
var START = exports.START = "Auktion beginnt!";

// export const OWN_BID_CHANGED = "ownBidChanged";
// export const HIGHEST_BID     = "highestBid";
// export const LOWER_BID       = "lowerBid";
// export const START           = "withoutBid";

// tense
var PRESENT = exports.PRESENT = "present";
var PAST = exports.PAST = "past";
var PAST_PERFECT = exports.PAST_PERFECT = "past-perfect";

},{}],8:[function(require,module,exports){
"use strict";

var NotificationService = require("services/NotificationService");
var WaitScreenService = require("services/WaitScreenService");

module.exports = function ($) {

    var _eventListeners = {};

    return {
        get: _get,
        put: _put,
        post: _post,
        delete: _delete,
        send: _send,
        setToken: _setToken,
        getToken: _getToken,
        listen: _listen
    };

    function _listen(event, handler) {
        _eventListeners[event] = _eventListeners[event] || [];
        _eventListeners[event].push(handler);
    }

    function _triggerEvent(event, payload) {
        if (_eventListeners[event]) {
            for (var i = 0; i < _eventListeners[event].length; i++) {
                var listener = _eventListeners[event][i];

                if (typeof listener !== "function") {
                    continue;
                }
                listener.call(Object, payload);
            }
        }
    }

    function _get(url, data, config) {
        config = config || {};
        config.method = "GET";
        return _send(url, data, config);
    }

    function _put(url, data, config) {
        config = config || {};
        config.method = "PUT";
        return _send(url, data, config);
    }

    function _post(url, data, config) {
        config = config || {};
        config.method = "POST";
        return _send(url, data, config);
    }

    function _delete(url, data, config) {
        config = config || {};
        config.method = "DELETE";
        return _send(url, data, config);
    }

    function _send(url, data, config) {
        var deferred = $.Deferred();

        config = config || {};
        config.data = data || null;
        config.dataType = config.dataType || "json";
        config.contentType = config.contentType || "application/x-www-form-urlencoded; charset=UTF-8";
        config.doInBackground = !!config.doInBackground;
        config.supressNotifications = !!config.supressNotifications;

        if (!config.doInBackground) {
            WaitScreenService.showWaitScreen();
        }
        $.ajax(url, config).done(function (response) {
            if (!config.supressNotifications) {
                printMessages(response);
            }
            for (var event in response.events) {
                _triggerEvent(event, response.events[event]);
            }
            deferred.resolve(response.data || response);
        }).fail(function (jqXHR) {
            var response = jqXHR.responseText ? $.parseJSON(jqXHR.responseText) : {};

            if (!config.supressNotifications) {
                printMessages(response);
            }
            deferred.reject(response);
        }).always(function () {
            if (!config.doInBackground) {
                WaitScreenService.hideWaitScreen();
            }
        });

        return deferred;
    }

    function printMessages(response) {
        var notification;

        if (response.error && response.error.message.length > 0) {
            notification = NotificationService.error(response.error);
        }

        if (response.success && response.success.message.length > 0) {
            notification = NotificationService.success(response.success);
        }

        if (response.warning && response.warning.message.length > 0) {
            notification = NotificationService.warning(response.warning);
        }

        if (response.info && response.info.message.length > 0) {
            notification = NotificationService.info(response.info);
        }

        if (response.debug && response.debug.class.length > 0) {
            notification.trace(response.debug.file + "(" + response.debug.line + "): " + response.debug.class);
            for (var i = 0; i < response.debug.trace.length; i++) {
                notification.trace(response.debug.trace[i]);
            }
        }
    }

    function _setToken(token) {
        this._token = token;
    }

    function _getToken() {
        return this._token;
    }
}(jQuery);

},{"services/NotificationService":9,"services/WaitScreenService":10}],9:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function ($) {

    var notificationCount = 0;
    var notifications = new NotificationList();

    var handlerList = [];
    // var printStackTrace = true;

    return {
        log: _log,
        info: _info,
        warn: _warn,
        error: _error,
        success: _success,
        getNotifications: getNotifications,
        listen: _listen
    };

    function _listen(handler) {
        handlerList.push(handler);
    }

    function trigger() {
        for (var i = 0; i < handlerList.length; i++) {
            handlerList[i].call({}, notifications.all());
        }
    }

    function _log(message, prefix) {
        var notification = new Notification(message);

        console.log((prefix || "") + "[" + notification.code + "] " + notification.message);

        for (var i = 0; i < notification.stackTrace.length; i++) {
            _log(notification.stackTrace[i], " + ");
        }

        return notification;
    }

    function _info(message) {
        var notification = new Notification(message, "info");

        _printNotification(notification);

        return notification;
    }

    function _warn(message) {
        var notification = new Notification(message, "warning");

        _printNotification(notification);

        return notification;
    }

    function _error(message) {
        var notification = new Notification(message, "danger");

        _printNotification(notification);

        return notification;
    }

    function _success(message) {
        var notification = new Notification(message, "success");

        _printNotification(notification);

        return notification;
    }

    function getNotifications() {
        return notifications;
    }

    function _printNotification(notification) {
        notifications.add(notification);
        _log(notification);

        trigger();

        return notification;
    }

    function Notification(data, context) {
        if (!this.printStackTrace && (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
            data.stackTrace = [];
        }
        var id = notificationCount++;
        var self = {
            id: id,
            code: data.code || null,
            message: data.message || data || "",
            context: context || "info",
            stackTrace: data.stackTrace || [],
            close: close,
            closeAfter: closeAfter,
            trace: trace
        };

        return self;

        function close() {
            notifications.remove(self);
            trigger();
        }

        function closeAfter(timeout) {
            setTimeout(function () {
                notifications.remove(self);
                trigger();
            }, timeout);
        }

        function trace(message, code) {
            if (this.printStackTrace) {
                self.stackTrace.push({
                    code: code || 0,
                    message: message
                });
            }
        }
    }

    function NotificationList() {
        var elements = [];

        return {
            all: all,
            add: add,
            remove: remove
        };

        function all() {
            return elements;
        }

        function add(notification) {
            elements.push(notification);
        }

        function remove(notification) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].id === notification.id) {
                    elements.splice(i, 1);
                    break;
                }
            }
        }
    }
}(jQuery);

},{}],10:[function(require,module,exports){
"use strict";

module.exports = function ($) {

    var overlay = {
        count: 0,
        isVisible: false
    };

    return {
        getOverlay: getOverlay,
        showWaitScreen: showWaitScreen,
        hideWaitScreen: hideWaitScreen
    };

    function getOverlay() {
        return overlay;
    }

    function showWaitScreen() {
        overlay.count = overlay.count || 0;
        overlay.count++;
        overlay.isVisible = true;
    }

    function hideWaitScreen(force) {
        overlay.count = overlay.count || 0;
        if (overlay.count > 0) {
            overlay.count--;
        }

        if (force) {
            overlay.count = 0;
        }

        if (overlay.count <= 0) {
            overlay.count = 0;
            overlay.visible = false;
        }
    }
}(jQuery);

},{}]},{},[2,3,4,5,6,1,7])


// var ao = new Vue( {
//              el: '#addAuctionVue',
//              // components: {
//              //     child:
//              //         {
//              //             props: ['msg'],
//              //             // template: `{{ msg }}`
//              //
//              //         }
//              // }
//
//          } )
//

// helper ohne Vue

// function aoCustomReload()
// {
//     location.reload();
// }


//# sourceMappingURL=auction-app.js.map
