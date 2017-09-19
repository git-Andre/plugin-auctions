(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var NotificationService = require("services/NotificationService");

// const AuctionBidderService = require( "services/AuctionBidderService" );

Vue.component("auction-bids", {
    props: ["template", "userdata", "auction", "minBid", "auctionEnd"],
    // props: {
    //     template: String,
    //     userdata: {},
    //     auction: {},
    //     minBid: Number,
    //     auctionEnd: { type: Boolean, default: false }
    // },
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
        // this.initAuctionParams();
        this.auction = JSON.parse(this.auction);

        if (this.auction.bidderList.length > 1) {
            this.minBid = this.toFloatTwoDecimal(this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice + 1);
        } else {
            this.minBid = this.toFloatTwoDecimal(this.auction.startPrice);
        }
    },
    ready: function ready() {},

    methods: {
        addBid: function addBid() {
            var _this = this;

            if (this.isInputValid) {

                var pos = this.userdata.email.indexOf("@");
                var newBidderName = this.userdata.email.slice(0, 2) + " *** " + this.userdata.email.slice(pos - 2, pos);

                var currentBid = {
                    'customerMaxBid': this.toFloatTwoDecimal(this.maxCustomerBid),
                    'bidderName': newBidderName,
                    'customerId': parseInt(this.userdata.id),
                    'minBid': this.minBid
                };

                ApiService.put("/api/bidderlist/" + this.auctionid, JSON.stringify(currentBid), { contentType: "application/json" }).then(function (response) {
                    // alert( "addBid ende" );
                    _this.reload(500);
                }, function (error) {
                    alert('error3: ' + error.toString());
                });
            }
        },

        // addBidOld() {
        //     if ( this.isInputValid ) {
        //         var currentBid          = {
        //             'bidPrice': 1,
        //             'customerMaxBid': 2.1,
        //             'bidderName': "newBid***Kunde1",
        //             'customerId': 3
        //         };
        //         const newCustomerMaxBid = this.toFloatTwoDecimal( this.maxCustomerBid );
        //         const pos               = this.userdata.email.indexOf( "@" );
        //         const newBidderName     = this.userdata.email.slice( 0, 2 ) + " *** " + this.userdata.email.slice( pos - 2, pos );
        //
        //         const newUserId = parseInt( this.userdata.id );
        //
        //         const lastEntry = true;
        //
        //         AuctionBidderService.getBidderList( this.auctionid, lastEntry ).then(
        //             response => {
        //
        //                 const bidderListLastEntry = response;
        //
        //                 var lastBidPrice = this.toFloatTwoDecimal( bidderListLastEntry.bidPrice );
        //                 if ( lastBidPrice < 1.1 ) {
        //                     lastBidPrice = this.toFloatTwoDecimal( this.minBid - 1 );
        //                 }
        //                 const lastCustomerMaxBid = this.toFloatTwoDecimal( bidderListLastEntry.customerMaxBid );
        //                 const lastUserId         = parseInt( bidderListLastEntry.customerId );
        //
        //                 if ( lastUserId == newUserId ) {
        //
        //                     currentBid.bidPrice       = lastBidPrice;
        //                     currentBid.customerMaxBid = newCustomerMaxBid;
        //                     currentBid.bidderName     = newBidderName;
        //                     currentBid.customerId     = newUserId;
        //
        //                     this.newBid = currentBid;
        //                     this.updateAuctionWithNewBid();
        //                     // ToDo: Abfrage: eigenes Maximal-Gebot wirklich ändern?
        //                     NotificationService.info(
        //                         "Sie haben Ihr eigenes Maximal-Gebot verändert!<br>(auf: " + currentBid.customerMaxBid +
        //                         ")" )
        //                         .closeAfter( 3500 );
        //                 }
        //                 else {
        //                     if ( newCustomerMaxBid > lastCustomerMaxBid ) {
        //                         if ( newCustomerMaxBid < lastCustomerMaxBid + 1 ) {
        //                             currentBid.bidPrice = newCustomerMaxBid;
        //                         }
        //                         else {
        //                             currentBid.bidPrice = lastCustomerMaxBid + 1;
        //                         }
        //                         currentBid.customerMaxBid = newCustomerMaxBid;
        //                         currentBid.bidderName     = newBidderName;
        //                         currentBid.customerId     = newUserId;
        //
        //                         this.newBid = currentBid;
        //                         this.updateAuctionWithNewBid();
        //                         this.reload(3000);
        //                         NotificationService.success(
        //                             " GLÜCKWUNSCH<br>Sie sind jetzt der Höchstbietende..." )
        //                             .closeAfter( 3000 );
        //                     }
        //                     else {
        //                         currentBid.bidPrice       = newCustomerMaxBid;
        //                         currentBid.customerMaxBid = lastCustomerMaxBid;
        //                         currentBid.bidderName     = bidderListLastEntry.bidderName;
        //                         currentBid.customerId     = lastUserId;
        //
        //                         this.newBid = currentBid;
        //                         this.updateAuctionWithNewBid();
        //                         this.reload(3000);
        //
        //                         NotificationService.warn(
        //                             "Es gibt leider schon ein höheres Gebot..." )
        //                             .closeAfter( 3000 );
        //                     }
        //                 }
        //
        //                 // this.initAuctionParams();
        //             },
        //             error => {
        //                 alert( 'error2: ' + error.toString() );
        //             }
        //         );
        //     }
        // },
        // updateAuctionWithNewBid() {
        //     ApiService.put( "/api/bidderlist/" + this.auctionid, JSON.stringify( this.newBid ),
        //                                                          { contentType: "application/json" }
        //     )
        //         .then( response => {
        //                },
        //                error => {
        //                    alert( 'error3: ' + error.toString() );
        //                }
        //         );
        // },
        // initAuctionParams() {
        //     ApiService.get( "/api/auction/" + this.auctionid, {}, {} )
        //         .done( auction => {
        //             // Gibt es Gebote?
        //             if ( auction.bidderList.length > 1 ) {
        //                 this.minBid =
        //                     this.toFloatTwoDecimal( ( ( auction.bidderList[auction.bidderList.length - 1].bidPrice ) ) +
        //                         1 );
        //             }
        //             else {
        //                 this.minBid = this.toFloatTwoDecimal( auction.startPrice );
        //             }
        //         } )
        //         .fail( () => {
        //             alert( 'Upps - ein Fehler beim abholen ??!!' );
        //         } );
        // },

        toFloatTwoDecimal: function toFloatTwoDecimal(value) {
            return Math.round(parseFloat(value) * 100) / 100.0;
        },
        auctionend: function auctionend() {
            var startD = Math.trunc(new Date().getTime() / 1000);
            startD = startD - 24 * 60 * 60 + 7;
            var Bidtest = {
                "startDate": startD,
                "startHour": 16,
                "startMinute": 45,
                "auctionDuration": 1,
                "startPrice": this.minBid - 2
            };

            ApiService.put("/api/auction/34", JSON.stringify(Bidtest), { contentType: "application/json" }).done(function (auction) {
                // alert( "ok" );
            }).fail(function () {
                alert('Upps - ein Fehler beim auctionend ??!!');
            });
        },

        // afterAuction() {
        //     // um Probleme mit letzten Geboten bei geringen Zeitunterschieden zu umgehen
        //     setTimeout( () => {
        //         if ( this.userdata ) {
        //             const currentUserId = this.userdata.id;
        //             const lastEntry     = false;
        //
        //             AuctionBidderService.getBidderList( this.auctionid, lastEntry ).then(
        //                 response => {
        //
        //                     const bidderList          = response;
        //                     const bidderListLastEntry = bidderList[bidderList.length - 1];
        //
        //                     const lastUserId = bidderListLastEntry.customerId;
        //
        //                     // Gewinner eingeloggt ??
        //                     if ( currentUserId == lastUserId ) {
        //                         NotificationService.success(
        //                             "Herzlichen Glückwunsch!<br>Sie haben diese Auktion gewonnen!<br>Sie können jetzt zur Kasse gehen." )
        //                             .close;
        //                         alert( "  // item -> Basket\n" + "// Url -> Checkout" )
        //                         // item -> Basket
        //                         // Url -> Checkout
        //                     }
        //                     // Gewinner nicht eingeloggt !!
        //                     else {
        //                         var isUserInBidderList = false;
        //
        //                         for (var i = bidderList.length; --i > 0;) {
        //                             const userId = bidderList[i].customerId;
        //
        //                             if ( currentUserId == userId ) {
        //                                 isUserInBidderList = true;
        //                                 break
        //                             }
        //                         }
        //                         // ist der eingeloggte User in BidderList
        //                         if ( isUserInBidderList ) {
        //                             NotificationService.error(
        //                                 "Leider wurden Sie überboten...<br>Wir wünschen mehr Glück bei einer nächsten Auktion." ).close;
        //                             this.reload( 3000 );
        //                         }
        //                         // nein
        //                         else {
        //                             NotificationService.info( "Bei dieser Auktion haben Sie nicht mitgeboten." ).close;
        //                             this.reload( 3000 );
        //                         }
        //                     }
        //                 },
        //                 error => {
        //                     alert( 'error5: ' + error.toString() );
        //                 }
        //             );
        //         }
        //         else {
        //             NotificationService.warn( "Nicht angemeldet... -> reload" ).close;
        //             this.reload( 3000 );
        //         }
        //     }, 1500 );
        // },
        reload: function reload(timeout) {
            setTimeout(function () {
                location.reload();
            }, timeout);
        }
    },
    watch: {
        maxCustomerBid: function maxCustomerBid() {
            if (this.maxCustomerBid >= this.minBid) {
                if (this.userdata != null) {
                    this.isInputValid = true;
                } else {
                    NotificationService.error({ "message": "Bitte loggen Sie sich ein<br>bzw. registrieren Sie sich!" }).closeAfter(4000);
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

},{"services/ApiService":5,"services/NotificationService":6}],2:[function(require,module,exports){
"use strict";

// const NotificationService  = require( "services/NotificationService" );
// const ResourceService      = require( "services/ResourceService" );
// const AuctionBidderService = require( "services/AuctionBidderService" );

Vue.component("auction-show-bidderlist", {

    props: {
        "template": String,
        "auction": {}
    },

    data: function data() {
        return {
            bidderList: [],
            bidders: 0
        };
    },
    created: function created() {
        this.$options.template = this.template;

        this.auction = JSON.parse(this.auction);

        var bidderData = this.auction.bidderList;
        var differentBidders = [0];

        this.bidderList = [];
        for (var i = bidderData.length; --i >= 0;) {
            var bidView = {};

            bidView.bidderName = bidderData[i].bidderName;
            bidView.bidPrice = bidderData[i].bidPrice;
            bidView.bidTimeStamp = bidderData[i].bidTimeStamp * 1000;

            this.bidderList.push(bidView);

            var currentUserId = bidderData[i].customerId;

            if (differentBidders.indexOf(currentUserId) < 0) {
                differentBidders.push(currentUserId);
            }
        }
        this.bidders = differentBidders.length - 1;

        // AuctionBidderService.getBidderList( this.auctionid )
        //     .then(
        //         response => {
        //             const bidderData     = response;
        //             var differentBidders = [0];
        //
        //             this.bidderList = [];
        //             for (var i = bidderData.length; --i >= 0;) {
        //                 var bidView = {};
        //
        //                 bidView.bidderName   = bidderData[i].bidderName;
        //                 bidView.bidPrice     = bidderData[i].bidPrice;
        //                 bidView.bidTimeStamp = bidderData[i].bidTimeStamp * 1000;
        //
        //                 this.bidderList.push( bidView );
        //
        //                 const currentUserId = bidderData[i].customerId;
        //
        //                 if ( differentBidders.indexOf( currentUserId ) < 0 ) {
        //                     differentBidders.push( currentUserId );
        //                 }
        //             }
        //             this.bidders = differentBidders.length - 1;
        //         },
        //         error => {
        //             alert( 'error4: ' + error.toString() );
        //         }
        //     );
        // AuctionBidderService.getExpiryDate( this.auctionid )
        //     .then(
        //         response => {
        //
        //             this.expiryDate = response;
        //
        //             // if ( Math.trunc( (new Date()).getTime() / 1000 ) < this.expiryDate ) {
        //             //     this.isAuctionPresent = true;
        //             // }
        //             // else {
        //             //     this.isAuctionPresent = false;
        //             // };
        //         },
        //         error => {
        //             alert( 'error5: ' + error.toString() );
        //         }
        //     );
    },
    ready: function ready() {},


    methods: {}
});

},{}],3:[function(require,module,exports){
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

},{"services/NotificationService":6}],4:[function(require,module,exports){
"use strict";

Vue.component("auction-countdown", {
    ready: function ready() {
        var _this = this;

        this.timer = setInterval(function () {
            _this.Timer();
        }, 1000);
    },

    props: ["template", "deadline", "timer"],
    data: function data() {
        return {
            now: Math.trunc(new Date().getTime() / 1000),
            diff: 0
        };
    },
    created: function created() {
        this.$options.template = this.template;
        this.deadline = 0;
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

},{}],5:[function(require,module,exports){
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

},{"services/NotificationService":6,"services/WaitScreenService":7}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}]},{},[1,2,3,4])


// var ao = new Vue( {
//                       el: '#addAuctionVue',
//                       data: {
//                           // messages: []
//                       }
//
//                   } )
//

//# sourceMappingURL=auction-app.js.map
