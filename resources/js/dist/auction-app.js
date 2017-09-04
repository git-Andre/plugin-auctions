(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService"); // /plugin-ceres/resources/js/src/app/services/ApiService.js
var NotificationService = require("services/NotificationService");
var AuctionBidderService = require("services/AuctionBidderService");

Vue.component("auction-bids", {
    props: ["template", "auctionid", "userdata", "minBid", "versand"],
    data: function data() {
        return {
            isInputValid: false,
            maxCustomerBid: null
        };
    },
    created: function created() {
        this.$options.template = this.template;
        this.minBid = 0;
        this.initAuctionParams();
        this.userdata = JSON.parse(this.userdata);
        this.auctionid = parseInt(this.auctionid);
    },
    ready: function ready() {},

    methods: {
        addBid: function addBid() {
            var _this = this;

            var currentBid = {
                'bidPrice': 1,
                'customerMaxBid': 2.1,
                'bidderName': "versand***Kunde1",
                'customerId': 3
            };
            var maxCustomerBid = this.toFloatTwoDecimal(this.maxCustomerBid);
            var bidderName = this.userdata.firstName + "...";
            var userId = parseInt(this.userdata.id);

            AuctionBidderService.getBidderListLastEntry(this.auctionid).then(function (response) {

                var bidderListLastEntry = response;

                var lastBidPrice = _this.toFloatTwoDecimal(bidderListLastEntry.bidPrice);
                if (lastBidPrice < 1.1) {
                    lastBidPrice = _this.toFloatTwoDecimal(_this.minBid - 1);
                }
                var lastCustomerMaxBid = _this.toFloatTwoDecimal(bidderListLastEntry.customerMaxBid);
                var lastUserId = parseInt(bidderListLastEntry.customerId);

                if (lastUserId == userId) {
                    NotificationService.success("Sie haben Ihr eigenes Gebot erhöht!").closeAfter(3000);
                    alert('Sie haben Ihr eigenes Gebot erhöht!');
                }
                if (maxCustomerBid > lastCustomerMaxBid) {

                    currentBid.bidPrice = lastBidPrice + 1;
                    currentBid.customerMaxBid = maxCustomerBid;
                    currentBid.bidderName = bidderName;
                    currentBid.customerId = userId;
                    // alert( 'Glückwunsch - Sie sind der Höchstbietende...' );
                    NotificationService.success("Glückwunsch - Sie sind der Höchstbietende...");
                    // .closeAfter( 3000 );
                } else {
                    currentBid.bidPrice = maxCustomerBid;
                    currentBid.customerMaxBid = lastCustomerMaxBid;
                    currentBid.bidderName = bidderListLastEntry.bidderName;
                    currentBid.customerId = lastUserId;

                    alert('Es gibt leider schon ein höheres Gebot...');

                    NotificationService.success("Es gibt leider schon ein höheres Gebot...").closeAfter(3000);
                }
                _this.versand = currentBid;
                _this.updateAuction();
                _this.versand = {};
            }, function (error) {
                NotificationService.error('Schade - ein Fehler beim abspeichern').closeAfter(3000);
                alert('error2: ' + error.toString());
            });
        },
        updateAuction: function updateAuction() {
            ApiService.put("/api/bidderlist/" + this.auctionid, JSON.stringify(this.versand), { contentType: "application/json" }).then(function (response) {
                // alert( "super!!!! abgespeichert" );
                NotificationService.success("test");
                /*.closeAfter( 3000 );*/
                location.reload();
            }, function (error) {
                NotificationService.error('Schade - ein Fehler beim abspeichern').closeAfter(3000);
                alert('error2: ' + error.toString());
            });
        },
        initAuctionParams: function initAuctionParams() {
            var _this2 = this;

            ApiService.get("/api/auction/" + this.auctionid, {}, { supressNotifications: false }).done(function (auction) {
                NotificationService.error('Juchuuh').closeAfter(3000);

                _this2.minBid = _this2.toFloatTwoDecimal(auction.bidderList[auction.bidderList.length - 1].bidPrice + 1);
                if (_this2.minBid < 1.1) {
                    _this2.minBid = _this2.toFloatTwoDecimal(auction.currentPrice + 1);
                }
            }).fail(function () {
                alert('Upps - ein Fehler beim abholen ??!!');
            });
            this.versand = {};
        },
        toFloatTwoDecimal: function toFloatTwoDecimal(value) {
            return Math.round(parseFloat(value) * 100) / 100.0;
        }
    },
    computed: {},
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

},{"services/ApiService":3,"services/AuctionBidderService":4,"services/NotificationService":5}],2:[function(require,module,exports){
"use strict";

Vue.component("auction-countdown", {
    ready: function ready() {
        var _this = this;

        window.setInterval(function () {
            _this.now = Math.trunc(new Date().getTime() / 1000);
        }, 1000);
    },

    props: ["template", "deadline", "date"],
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
        },
        stopAuction: function stopAuction() {
            // Todo: herzlichen GWunsch Modal if loggedin user last Bidder... - CHECKOUT this item ???!!?
            location.reload();
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
            if (this.diff <= 0) {
                // if ( this.diff <= 0 || this.stop ) {
                this.diff = 0;
                // Remove interval
                window.clearInterval();
                this.stopAuction();
            }
        }
    }
});

},{}],3:[function(require,module,exports){
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

},{"services/NotificationService":5,"services/WaitScreenService":6}],4:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var NotificationService = require("services/NotificationService");

module.exports = function ($) {

    var bidderListLastEntry;
    var getPromise;

    return {
        getBidderListLastEntry: getBidderListLastEntry
    };

    function getBidderListLastEntry(auctionId) {
        return new Promise(function (resolve, reject) {
            if (auctionId) {
                ApiService.get("/api/auction/" + auctionId).then(function (response) {
                    NotificationService.error("TEST").closeAfter(3000);
                    // setTimeout( () =>
                    //     resolve( response.bidderList[response.bidderList.length - 1] ), 1000 );
                    resolve(response.bidderList[response.bidderList.length - 1]);
                }, function (error) {
                    reject(error);
                });
            } else {
                alert('Fehler mit id:: ' + auctionId);
            }
        });
    }
}(jQuery);

},{"services/ApiService":3,"services/NotificationService":5}],5:[function(require,module,exports){
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

},{}]},{},[1,2])



//# sourceMappingURL=auction-app.js.map
