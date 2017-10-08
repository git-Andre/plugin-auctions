(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var NotificationService = require("services/NotificationService");
var AuctionConstants = require("constants/AuctionConstants");
var AuctionBidderService = require("services/AuctionBidderService");

// (mini encrypt() ToDo: richtig verschlüsseln - evtl. auch die MaxBids für späteren Gebrauch (KundenKonto) s. server- php
var NOTIFY_TIME = 10000;

Vue.component("auction-bids", {
    props: ["template", "userdata", "auction", "minbid", "auctionEnd", "item"],
    data: function data() {
        return {
            // auction: {},
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
        // this.currentBid = {};
    },
    ready: function ready() {
        this.auction = JSON.parse(this.auction);
        this.minbid = this.toFloatTwoDecimal(this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice + 1);

        // tense "present" und Customer loggedIn ??
        if ((this.auction.tense == AuctionConstants.PRESENT || this.auction.tense == AuctionConstants.PAST) && this.userdata != null) {
            // Auswertung für Bieter in Bidderlist bzw. auch für den gerade in Session gespeicherten User... ???!!
            if (this.hasLoggedInUserBiddenYet() || sessionStorage.getItem("currentBidder") == this.userdata.id) {
                this.evaluateAndNotify();
            }
        } else {
            if (this.auction.tense == AuctionConstants.PAST && this.userdata != null) {}
        }
    },

    methods: {
        addBid: function addBid() {
            var _this = this;

            ApiService.get("/api/auctionbidprice/" + this.auction.id).done(function (lastBidPrice) {
                // ist es ein gültiges Gebot (höher als letztes Gebot) ?
                if (_this.maxCustomerBid > _this.toFloatTwoDecimal(lastBidPrice)) {

                    var pos = _this.userdata.email.indexOf("@");
                    var newBidderName = _this.userdata.email.slice(0, 2) + " *** " + _this.userdata.email.slice(pos - 2, pos);

                    var currentBid = {
                        'customerMaxBid': _this.toFloatTwoDecimal(_this.maxCustomerBid),
                        'bidderName': newBidderName,
                        'customerId': parseInt(_this.userdata.id)
                    };

                    // super Time Tunnel
                    sessionStorage.setItem("currentBidder", _this.userdata.id);

                    ApiService.put("/api/bidderlist/" + _this.auction.id, JSON.stringify(currentBid), { contentType: "application/json" }).then(function (response) {
                        _this.reload(5);
                    }, function (error) {
                        alert('error3: ' + error.toString());
                    });
                }
                // es gibt inzwischen schon ein höheres Gebot
                else {
                        NotificationService.warn(
                        // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                        "<h3>STATUS:</h3><hr>Es wurde schon ein höheres Maximal-Gebot abgegeben...").close;
                        _this.reload(2600); // :)
                    }
            }).fail(function () {
                alert('Upps - ein Fehler bei auctionbidprice ??!!');
            });
        },
        evaluateAndNotify: function evaluateAndNotify() {
            if (this.hasLoggedInUserTheLastBid()) {
                // vorletztes Gebot auch von mir ? - entweder mein MaxGebot geändert, oder unterlegenes Gebot... ?
                if (this.auction.bidderList[this.auction.bidderList.length - 2].customerId == this.userdata.id) {
                    switch (this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus.toString()) {
                        case AuctionConstants.OWN_BID_CHANGED:
                            {
                                NotificationService.info(
                                // "<span><i class=\"fa fa-info-circle p-l-0 p-r-1\"></span>" +
                                "<h3>Letzte Aktion:</h3><hr>" + "Sie haben Ihr eigenes Maximal-Gebot geändert!").closeAfter(NOTIFY_TIME);
                                break;
                            }
                        case AuctionConstants.LOWER_BID:
                            {
                                NotificationService.success({
                                    "message":
                                    // "<i class=\"fa fa-check-circle p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                    "<h3>STATUS:</h3><hr>Es wurde ein geringeres Maximal-Gebot abgegeben... " + "<br> Sie sind aber immer noch Höchstbietende(r)..."
                                }).closeAfter(NOTIFY_TIME);
                                break;
                            }
                    }
                } else {
                    // bidStatus von letzter bid ???
                    switch (this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus.toString()) {
                        case AuctionConstants.OWN_BID_CHANGED:
                            {
                                NotificationService.info(
                                // "<i class=\"fa fa-info-circle p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                "<h3>STATUS:</h3><hr>Sie haben Ihr eigenes Maximal-Gebot verändert!").closeAfter(NOTIFY_TIME);
                                break;
                            }
                        case AuctionConstants.HIGHEST_BID:
                            {
                                NotificationService.success(
                                // "<i class=\"fa fa-check-circle-o p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                "<h3>GLÜCKWUNSCH:</h3><hr>Sie sind derzeit Höchstbietende(r)...").closeAfter(NOTIFY_TIME);
                                break;
                            }
                        case AuctionConstants.LOWER_BID:
                            {
                                NotificationService.warn(
                                // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                "<h3>STATUS:</h3><hr>Es wurde schon ein höheres Maximal-Gebot abgegeben...").closeAfter(NOTIFY_TIME);

                                break;
                            }
                            console.log('keine Info / bidStatus ?????: ');
                    }
                }
            } else {
                NotificationService.warn(
                // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                "<h3>STATUS:</h3><hr>Es wurde schon ein höheres Maximal-Gebot abgegeben...").closeAfter(NOTIFY_TIME);
            }
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
            } else {
                return false;
            }
        },
        toFloatTwoDecimal: function toFloatTwoDecimal(value) {
            return Math.round(parseFloat(value) * 100) / 100.0;
        },
        help: function help() {
            var startD = Math.trunc(new Date().getTime() / 1000);
            startD = startD - 24 * 60 * 60 + 7;
            var Bidtest = {
                "startDate": startD,
                "startHour": 16,
                "startMinute": 45,
                "auctionDuration": 1,
                "startPrice": this.minbid - 2
            };

            ApiService.put("/api/auction/2", JSON.stringify(Bidtest), { contentType: "application/json" }).done(function (auction) {
                // alert( "ok" );
            }).fail(function () {
                alert('Upps - ein Fehler beim auctionend ??!!');
            });
        },
        auctionend: function auctionend() {
            // ApiService.post( "/rest/orders", JSON.stringify( orderBuilder ), { contentType: "application/json" }
            //api/placeorder/{auctionId}
            ApiService.get("/api/placeorder/" + this.auction.id).done(function (auction) {
                console.dir(auction);
                alert("ok");
            }).fail(function () {
                alert('Upps - AUTH (mist) ??!!');
            });
        },
        afterAuction: function afterAuction() {
            var _this2 = this;

            // gibt es Gebote UND loggedInUser der Gewinner?
            // dann place Order...

            // um Probleme mit letzten Geboten bei geringen Zeitunterschieden zu umgehen
            setTimeout(function () {
                if (_this2.userdata) {
                    var _currentUserId = _this2.userdata.id;
                    var lastEntry = true;

                    AuctionBidderService.getBidderList(_this2.auctionid, lastEntry).then(function (response) {

                        var bidderListLastEntry = response;

                        // Gewinner eingeloggt (UND es gab Gebote - ToDo: kann weg)??
                        if (_currentUserId == bidderListLastEntry.customerId && _this2.auction.startPrice != bidderListLastEntry.bidPrice) {
                            ApiService.get("/api/placeorder/" + _this2.auction.Id).done(function (auction) {
                                console.dir(auction);
                                alert("ok");
                                // this.reload( 10 );
                            }).fail(function () {
                                alert('Upps - Gewinner eingeloggt - aber... ???!!');
                            });
                        }
                        // Gewinner nicht eingeloggt !!
                        else {
                                _this2.reload(10);
                            }
                    }, function (error) {
                        alert('error6: ' + error.toString());
                    });
                } else {
                    NotificationService.warn("Nicht angemeldet... -> reload").close;
                    _this2.reload(3000);
                }
            }, 1500);
        },
        help2: function help2() {
            // geparkt für evaluate & notify

            // Gewinner eingeloggt ??
            if (currentUserId == lastUserId) {
                NotificationService.success("Herzlichen Glückwunsch!<br>Sie haben diese Auktion gewonnen!<br>Sie können jetzt zur Kasse gehen.").close;
                alert("  // item -> Basket\n" + "// Url -> Checkout");
                // item -> Basket
                // Url -> Checkout
            }
            // Gewinner nicht eingeloggt !!
            else {
                    var isUserInBidderList = false;

                    for (var i = bidderList.length; --i > 0;) {
                        var userId = bidderList[i].customerId;

                        if (currentUserId == userId) {
                            isUserInBidderList = true;
                            break;
                        }
                    }
                    // ist der eingeloggte User in BidderList
                    if (isUserInBidderList) {
                        NotificationService.error("Leider wurden Sie überboten...<br>Wir wünschen mehr Glück bei einer nächsten Auktion.").close;
                        this.reload(3000);
                    }
                    // nein
                    else {
                            NotificationService.info("Bei dieser Auktion haben Sie nicht mitgeboten.").close;
                            this.reload(3000);
                        }
                }
        },
        reload: function reload(timeout) {
            setTimeout(function () {
                location.reload();
            }, timeout);
        },
        getCurrentBidPrice: function getCurrentBidPrice() {}
    },
    watch: {

        maxCustomerBid: function maxCustomerBid() {
            if (this.maxCustomerBid >= this.minbid) {
                if (this.userdata != null) {
                    this.isInputValid = true;
                } else {
                    NotificationService.error({ "message": "Bitte loggen Sie sich ein<br>bzw. registrieren Sie sich!" }).closeAfter(5000);
                    this.isInputValid = false;
                }
            } else {
                this.isInputValid = false;
            }
        },
        auctionEnd: function auctionEnd() {
            if (this.auctionEnd) {
                this.afterAuction();
            }
        }
    }

});

},{"constants/AuctionConstants":6,"services/ApiService":7,"services/AuctionBidderService":8,"services/NotificationService":9}],2:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
// const NotificationService = require( "services/NotificationService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

Vue.component("auction-end", {
    props: ["item"],
    data: function data() {
        return {};
    },
    created: function created() {},
    compiled: function compiled() {},
    ready: function ready() {},

    methods: {
        getTest: function getTest() {
            alert('auctionEnd');

            // ApiService.get( "/api/auction/" + this.auctionid )
            //     .done( auction => {
            //         this.auction = auction;
            //         this.$children['AuctionBids'].auction = this.auction;
            //     } )
            //     .fail( () => {
            //                alert( 'Upps - ein Fehler bei biddersFromServer ??!!' );
            //            }
            //     )
        }
    }
});

},{"services/ApiService":7}],3:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");

Vue.component("auction-show-bidderlist", {

    props: {
        "template": String,
        "auctionid": String
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

            ApiService.get("/api/bidderlist/" + this.auctionid).done(function (biddersFromServer) {

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
                alert('Upps - ein Fehler bei biddersFromServer ??!!');
            });
        }
    }
});

},{"services/ApiService":7}],4:[function(require,module,exports){
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

},{"services/NotificationService":9}],5:[function(require,module,exports){
"use strict";

Vue.component("auction-countdown", {
    props: ["template", "deadline", "timer", "now", "diff"],
    data: function data() {
        return {};
    },
    created: function created() {
        this.$options.template = this.template;
        this.deadline = parseInt(this.deadline);
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
                return '0' + value.toString();
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"services/NotificationService":9,"services/WaitScreenService":10}],8:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var NotificationService = require("services/NotificationService");

module.exports = function ($) {

    var bidderListLastEntry;
    var getPromise;

    return {
        // getBidderList: getBidderList,
        // getExpiryDate: getExpiryDate,
        getCurrentBidPrice: getCurrentBidPrice
    };

    function getBidderList(auctionId) {
        var lastEntry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        return new Promise(function (resolve, reject) {
            if (auctionId) {
                ApiService.get("/api/auction/" + auctionId).then(function (auction) {
                    // setTimeout( () =>
                    //     resolve( auction.bidderList[auction.bidderList.length - 1] ), 1000 );
                    if (lastEntry) {
                        resolve(auction.bidderList[auction.bidderList.length - 1]);
                    } else {
                        auction.bidderList[0].bidPrice = auction.startPrice;
                        auction.bidderList[0].bidTimeStamp = auction.startDate;

                        resolve(auction.bidderList);
                    }
                }, function (error) {
                    reject(error);
                });
            } else {
                alert('Fehler in id:: ' + auctionId);
            }
        });
    }

    function getCurrentBidPrice(auctionId) {
        return new Promise(function (resolve, reject) {
            if (auctionId) {

                ApiService.get("/api/auctionbidprice/" + auctionId).then(function (currentBidPrice) {
                    resolve(currentBidPrice);
                }, function (error) {
                    reject(error);
                });
            } else {
                alert('Fehler in id: ' + auctionId);
            }
        });
    }

    // function getExpiryDate(auctionId) {
    //     return new Promise( (resolve, reject) => {
    //                             if ( auctionId ) {
    //
    //                                 ApiService.get( "/api/auction/" + auctionId )
    //                                     .then( auction => {
    //                                                resolve( auction.expiryDate );
    //                                            },
    //                                            error => {
    //                                                reject( error );
    //                                            }
    //                                     )
    //                             }
    //                             else {
    //                                 alert( 'Fehler in id (Date):: ' + auctionId );
    //                             }
    //                         }
    //     )
    // }
}(jQuery);

},{"services/ApiService":7,"services/NotificationService":9}],9:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function ($) {

    var notificationCount = 0;
    var notifications = new NotificationList();

    var handlerList = [];
    var printStackTrace = true;
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

},{}]},{},[1,2,3,4,5,6])


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
function aoCustomReload() {
    location.reload()
}


//# sourceMappingURL=auction-app.js.map
