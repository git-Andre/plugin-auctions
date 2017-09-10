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
        this.auctionid = parseInt(this.auctionid);
        this.initAuctionParams();
        this.versand = {};
    },
    ready: function ready() {
        this.userdata = JSON.parse(this.userdata);
    },

    methods: {
        addBid: function addBid() {
            var _this = this;

            var currentBid = {
                'bidPrice': 1,
                'customerMaxBid': 2.1,
                'bidderName': "versand***Kunde1",
                'customerId': 3
            };
            var newCustomerMaxBid = this.toFloatTwoDecimal(this.maxCustomerBid);
            var pos = this.userdata.email.indexOf("@");
            var newBidderName = this.userdata.email.slice(0, 2) + " *** " + this.userdata.email.slice(pos - 2, pos);

            // const newBidderName     = this.userdata.firstName ? this.userdata.firstName + "... ***": "*** ... ***";
            var newUserId = parseInt(this.userdata.id);

            var lastEntry = true;

            AuctionBidderService.getBidderList(this.auctionid, lastEntry).then(function (response) {

                var bidderListLastEntry = response;

                var lastBidPrice = _this.toFloatTwoDecimal(bidderListLastEntry.bidPrice);
                if (lastBidPrice < 1.1) {
                    lastBidPrice = _this.toFloatTwoDecimal(_this.minBid - 1);
                }
                var lastCustomerMaxBid = _this.toFloatTwoDecimal(bidderListLastEntry.customerMaxBid);
                var lastUserId = parseInt(bidderListLastEntry.customerId);

                if (lastUserId == newUserId) {

                    currentBid.bidPrice = lastBidPrice;
                    currentBid.customerMaxBid = newCustomerMaxBid;
                    currentBid.bidderName = newBidderName;
                    currentBid.customerId = newUserId;

                    // ToDo: Abfrage: eigenes Maximal-Gebot wirklich ändern?
                    // alert( 'Sie haben Ihr eigenes Maximal-Gebot verändert!' );
                } else {
                    if (newCustomerMaxBid > lastCustomerMaxBid) {
                        if (newCustomerMaxBid < lastCustomerMaxBid + 1) {
                            currentBid.bidPrice = newCustomerMaxBid;
                        } else {
                            currentBid.bidPrice = lastCustomerMaxBid + 1;
                        }
                        currentBid.customerMaxBid = newCustomerMaxBid;
                        currentBid.bidderName = newBidderName;
                        currentBid.customerId = newUserId;

                        alert('Glückwunsch - Sie sind der Höchstbietende...');
                    } else {
                        currentBid.bidPrice = lastBidPrice + 1;
                        currentBid.customerMaxBid = lastCustomerMaxBid;
                        currentBid.bidderName = bidderListLastEntry.bidderName;
                        currentBid.customerId = lastUserId;

                        alert('Es gibt leider schon ein höheres Gebot...');
                    }
                }
                NotificationService.error("Translations.Template.itemWishListAdded");
                NotificationService.success("YEAH Translations.Template.itemWishListAdded");
                console.dir(NotificationService.getNotifications());

                _this.showModal("Hallo");

                _this.versand = currentBid;
                _this.updateAuction();
                _this.versand = {};
                // location.reload();
            }, function (error) {
                alert('error2: ' + error.toString());
            });
        },
        updateAuction: function updateAuction() {
            ApiService.put("/api/bidderlist/" + this.auctionid, JSON.stringify(this.versand), { contentType: "application/json" }).then(function (response) {
                // alert( response );
            }, function (error) {
                alert('error3: ' + error.toString());
            });
        },
        initAuctionParams: function initAuctionParams() {
            var _this2 = this;

            ApiService.get("/api/auction/" + this.auctionid, {}, {}).done(function (auction) {
                _this2.minBid = _this2.toFloatTwoDecimal(auction.bidderList[auction.bidderList.length - 1].bidPrice + 1);
                if (_this2.minBid < 1.1) {
                    _this2.minBid = _this2.toFloatTwoDecimal(auction.currentPrice + 1);
                }
            }).fail(function () {
                alert('Upps - ein Fehler beim abholen ??!!');
            });
        },
        toFloatTwoDecimal: function toFloatTwoDecimal(value) {
            return Math.round(parseFloat(value) * 100) / 100.0;
        },

        showModal: function showModal(content, isExternalContent) {
            var $modal = $(this.$els.modal);
            var $modalBody = $(this.$els.modalContent);

            console.log('content: ' + content);
            if (isExternalContent) {
                $modalBody.html("<iframe src=\"" + content + "\">");
            } else {
                $modalBody.html(content);
            }

            $modal.modal("show");
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

},{"services/ApiService":4,"services/AuctionBidderService":5,"services/NotificationService":6}],2:[function(require,module,exports){
"use strict";

// const NotificationService  = require( "services/NotificationService" );
// const ResourceService      = require( "services/ResourceService" );
var AuctionBidderService = require("services/AuctionBidderService");

Vue.component("auction-show-bidderlist", {

    props: ["template", "auctionid", "expiryDate"],

    data: function data() {
        return {
            bidderList: [],
            isAuctionPresent: false,
            bidders: 0
        };
    },
    created: function created() {
        var _this = this;

        this.$options.template = this.template;

        AuctionBidderService.getBidderList(this.auctionid).then(function (response) {
            var bidderData = response;
            var differentBidders = [0];

            _this.bidderList = [];
            for (var i = bidderData.length; --i >= 0;) {
                var bidView = {};

                bidView.bidderName = bidderData[i].bidderName;
                bidView.bidPrice = bidderData[i].bidPrice;
                bidView.bidTimeStamp = bidderData[i].bidTimeStamp * 1000;

                _this.bidderList.push(bidView);

                var currentUserId = bidderData[i].customerId;

                if (differentBidders.indexOf(currentUserId) < 0) {
                    differentBidders.push(currentUserId);
                }
            }
            _this.bidders = differentBidders.length - 1;
        }, function (error) {
            alert('error4: ' + error.toString());
        });
        AuctionBidderService.getExpiryDate(this.auctionid).then(function (response) {

            _this.expiryDate = response;

            if (Math.trunc(new Date().getTime() / 1000) < _this.expiryDate) {
                _this.isAuctionPresent = true;
            } else {
                _this.isAuctionPresent = false;
            };
        }, function (error) {
            alert('error5: ' + error.toString());
        });
    },
    ready: function ready() {},


    methods: {}
});

},{"services/AuctionBidderService":5}],3:[function(require,module,exports){
"use strict";

Vue.component("auction-countdown", {
    ready: function ready() {
        var _this = this;

        window.setInterval(function () {
            _this.now = Math.trunc(new Date().getTime() / 1000);
        }, 1000);
    },

    props: ["template", "deadline"
    // "stop"
    ],
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
        twoDigits: function twoDigits(value) {
            if (value.toString().length <= 1) {
                return '0' + value.toString();
            }
            return value.toString();
        },
        stopAuction: function stopAuction() {
            // Todo: herzlichen GWunsch Modal if loggedin user last Bidder... - CHECKOUT this item ???!!?
            //             location.reload();
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
            this.diff = this.deadline - this.now;
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

},{"services/NotificationService":6,"services/WaitScreenService":7}],5:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var NotificationService = require("services/NotificationService");

module.exports = function ($) {

    var bidderListLastEntry;
    var getPromise;

    return {
        getBidderList: getBidderList,
        getExpiryDate: getExpiryDate
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
                        auction.bidderList[0].bidPrice = auction.currentPrice;
                        auction.bidderList[0].bidTimeStamp = auction.startDate;

                        resolve(auction.bidderList);
                        NotificationService.success("TEST").closeAfter(3000);
                    }
                }, function (error) {
                    reject(error);
                });
            } else {
                alert('Fehler in id:: ' + auctionId);
            }
        });
    }

    function getExpiryDate(auctionId) {
        return new Promise(function (resolve, reject) {
            if (auctionId) {

                ApiService.get("/api/auction/" + auctionId).then(function (auction) {
                    resolve(auction.expiryDate);
                }, function (error) {
                    reject(error);
                });
            } else {
                alert('Fehler in id (Date):: ' + auctionId);
            }
        });
    }
}(jQuery);

},{"services/ApiService":4,"services/NotificationService":6}],6:[function(require,module,exports){
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

},{}]},{},[1,2,3])



//# sourceMappingURL=auction-app.js.map
