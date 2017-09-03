(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService"); // /plugin-ceres/resources/js/src/app/services/ApiService.js
var NotificationService = require("services/NotificationService");

Vue.component("auction-bids", {
    props: ["template", "auctionid", "userdata", "minBid"],
    data: function data() {
        return {
            isInputValid: false,
            maxCustomerBid: null
        };
    },
    created: function created() {
        this.$options.template = this.template;
        this.userdata = JSON.parse(this.userdata);
    },

    ready: function ready() {
        this.initMinBidPrice();
    },
    methods: {
        addBid: function addBid() {
            var bidderListLastEntry = {};
            this.getBidderListLastEntry().then(function (response) {
                bidderListLastEntry.bidPrice = response;
            }, function (error) {
                alert("Fehler const bidderListLastEntry");
            });
            var currentBid = {
                'bidPrice': 1,
                'customerMaxBid': 2,
                'bidderName': 'test***Kunde1',
                'customerId': 3
            };

            if (this.maxCustomerBid > bidderListLastEntry) {

                currentBid.bidPrice = bidderListLastEntry.customerMaxBid + 1;
                currentBid.customerMaxBid = this.maxCustomerBid;
                currentBid.bidderName = this.userdata.firstName;
                currentBid.customerId = this.userdata.id;

                // alert( 'Glückwunsch - Sie sind der Höchstbietende...' );
                this.updateAuction();
                NotificationService.success("Glückwunsch - Sie sind der Höchstbietende...").closeAfter(3000);
            } else {
                currentBid.bidPrice = this.maxCustomerBid;
                currentBid.customerMaxBid = bidderListLastEntry.bidPrice;
                currentBid.bidderName = bidderListLastEntry.bidderName;
                currentBid.customerId = bidderListLastEntry.customerId;

                // alert( 'Es gibt leider schon ein höheres Gebot...' );
                this.updateAuction(this.auctionid);

                NotificationService.success("Es gibt leider schon ein höheres Gebot...").closeAfter(3000);
            }

            // alert( 'this.userdata): ' + this.userdata.id + '\n' + '' );
        },
        initMinBidPrice: function initMinBidPrice() {
            var _this = this;

            ApiService.get("/api/auction/" + this.auctionid, {}, { supressNotifications: true }).done(function (auction) {
                _this.minBid = auction.bidderList[auction.bidderList.length - 1].bidPrice + 1;
            }).fail(function () {
                alert('Schade - ein Fehler beim abholen');
            });
        },
        updateSuccessBid: function updateSuccessBid() {
            // ApiService.get( "/api/auction/" + this.auctionid, {}, { supressNotifications: true } )
            //     .done( function (auction) {
            //         this.minBid = auction.bidderList[auction.bidderList.length - 1].bisPrice + 1;
            //
            //         ApiService.put( "/api/bidderlist/" + this.auctionid, currentBid,
            //                                                              { supressNotifications: false }
            //         )
            //             .done( function (auction) {
            //                 // alert ("super!!!! abgespeichert");
            //                 this.currentBid.bidPrice       = bidderListLastEntry.customerMaxBid + 1;
            //                 this.currentBid.customerMaxBid = this.maxCustomerBid;
            //                 this.currentBid.bidderName     = this.userdata.firstName;
            //                 this.currentBid.customerId     = this.userdata.id;
            //
            //                 // alert( 'Glückwunsch - Sie sind der Höchstbietende...' );
            //                 NotificationService.success( "Glückwunsch - Sie sind der Höchstbietende..." )
            //                     .closeAfter( 3000 );
            //             } )
            //             .fail( function (auction) {
            //                 NotificationService.error( 'Schade - ein Fehler beim abspeichern' ).closeAfter( 3000 );
            //                 alert( 'Schade - ein Fehler beim abspeichern' );
            //             } );
            //     } )
            //     .fail( function (auction) {
            //         alert( 'Schade - ein Fehler beim abholen' );
            //     } );
        },
        updateAuction: function updateAuction() {
            ApiService.put("/api/bidderlist/" + this.auctionid, currentBid, { supressNotifications: false }).done(function (auction) {
                // alert ("super!!!! abgespeichert");
            }).fail(function (auction) {
                NotificationService.error('Schade - ein Fehler beim abspeichern').closeAfter(3000);
                alert('Schade - ein Fehler beim abspeichern');
            });
        },
        getBidderListLastEntry: function getBidderListLastEntry() {

            ApiService.get("/api/auction/" + this.auctionid, {}, { supressNotifications: true }).done(function (auction) {
                return auction.bidderList[auction.bidderList.length - 1];
            }).fail(function (auction) {
                alert('Schade - ein Fehler beim abholen');
            });
        }
    },
    computed: {
        // bidderListLastBidPrice() {
        //     return this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice
        // },
        // // bidderListLastCustomerMaxBid() {
        // //     cache: false;
        // //     return this.auction.bidderList[this.auction.bidderList.length - 1].customerMaxBid
        // // },
        // bidderListLastBidderName() {
        //     return this.auction.bidderList[this.auction.bidderList.length - 1].bidderName
        // },
        // bidderListLastCustomerId() {
        //     return this.auction.bidderList[this.auction.bidderList.length - 1].customerId
        // }
    },
    watch: {
        maxCustomerBid: function maxCustomerBid() {
            if (this.maxCustomerBid >= this.minBid) {
                this.isInputValid = true;
            } else {
                this.isInputValid = false;
            }
        }
    }
});

},{"services/ApiService":4,"services/NotificationService":5}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"services/NotificationService":5,"services/WaitScreenService":6}],5:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function ($) {

    var notificationCount = 0;
    var notifications = new NotificationList();

    var handlerList = [];

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

        if (App.config.logMessages) {
            console.log((prefix || "") + "[" + notification.code + "] " + notification.message);

            for (var i = 0; i < notification.stackTrace.length; i++) {
                _log(notification.stackTrace[i], " + ");
            }
        }

        return notification;
    }

    function _info(message) {
        var notification = new Notification(message, "info");

        if (App.config.printInfos) {
            _printNotification(notification);
        }

        return notification;
    }

    function _warn(message) {
        var notification = new Notification(message, "warning");

        if (App.config.printWarnings) {
            _printNotification(notification);
        }

        return notification;
    }

    function _error(message) {
        var notification = new Notification(message, "danger");

        if (App.config.printErrors) {
            _printNotification(notification);
        }

        return notification;
    }

    function _success(message) {
        var notification = new Notification(message, "success");

        if (App.config.printSuccess) {
            _printNotification(notification);
        }

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
        if (!App.config.printStackTrace && (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
            data.stackTrace = [];
        }
        var id = notificationCount++;
        var self = {
            id: id,
            code: data.code || 0,
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
            if (App.config.printStackTrace) {
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

},{}],6:[function(require,module,exports){
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

},{}]},{},[1,2,3])



//# sourceMappingURL=auction-app.js.map
