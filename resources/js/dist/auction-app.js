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
            var newBidderName = this.userdata.email.slice(1, 2) + " ... ***";
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
                    alert('Sie haben Ihr eigenes Maximal-Gebot verändert!');
                    // NotificationService.success(Translations.Template.itemWishListAdded)
                } else {
                    if (newCustomerMaxBid > lastCustomerMaxBid) {

                        currentBid.bidPrice = lastCustomerMaxBid + 1;
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
                _this.versand = currentBid;
                _this.updateAuction();
                _this.versand = {};
                location.reload();
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

var NotificationService = require("services/NotificationService");
var ResourceService = require("services/ResourceService");
var AuctionBidderService = require("services/AuctionBidderService");

Vue.component("auction-show-bidderlist", {

    props: ["template", "auctionid"],

    data: function data() {
        return {
            bidderList: []
        };
    },
    created: function created() {
        AuctionBidderService.getBidderList(this.auctionid).then(function (response) {

            var bidderList = response;
        }, function (error) {
            alert('error4: ' + error.toString());
        });

        this.$options.template = this.template;

        this.bidderdata = JSON.parse(this.bidderdata);
        this.bidderList = [];

        for (var i = this.bidderdata.length; --i >= 0;) {
            var bidView = {};

            bidView.bidderName = this.bidderdata[i].bidderName;
            bidView.bidPrice = this.bidderdata[i].bidPrice;
            bidView.bidTimeStamp = this.bidderdata[i].bidTimeStamp;

            this.bidderList.push(bidView);
        }
        this.bidderdata = [];
    },
    ready: function ready() {},


    methods: {}
});

},{"services/AuctionBidderService":5,"services/NotificationService":6,"services/ResourceService":7}],3:[function(require,module,exports){
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
            //             location.reload();
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

},{"services/NotificationService":6,"services/WaitScreenService":8}],5:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var NotificationService = require("services/NotificationService");

module.exports = function ($) {

    var bidderListLastEntry;
    var getPromise;

    return {
        getBidderList: getBidderList
    };

    function getBidderList(auctionId) {
        var lastEntry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        return new Promise(function (resolve, reject) {
            if (auctionId) {
                ApiService.get("/api/auction/" + auctionId).then(function (response) {
                    NotificationService.error("TEST").closeAfter(3000);
                    // setTimeout( () =>
                    //     resolve( response.bidderList[response.bidderList.length - 1] ), 1000 );
                    if (lastEntry) {
                        resolve(response.bidderList[response.bidderList.length - 1]);
                    } else {
                        resolve(response.bidderList);
                    }
                }, function (error) {
                    reject(error);
                });
            } else {
                alert('Fehler in id:: ' + auctionId);
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

},{}],7:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ApiService = require("services/ApiService");

module.exports = function ($) {

    var resources = {};

    return {
        registerResource: registerResource,
        registerResourceList: registerResourceList,
        getResource: getResource,
        watch: watch,
        bind: bind
    };

    /**
     * Register a new resource
     * @param {string}  name          The name of the resource. Must be a unique identifier
     * @param {string}  route         The route to bind the resource to
     * @param {*}       initialValue  The initial value to assign to the resource
     *
     * @returns {Resource} The created resource.
     */
    function registerResource(name, route, initialValue, responseTemplate) {
        if (!name) {
            throw new Error("Cannot register resource. Name is required.");
        }

        if (!route && typeof initialValue === "undefined") {
            throw new Error("Cannot register resource. Route or initial value is required.");
        }

        if (resources[name]) {
            throw new Error("Resource '" + name + "' already exists.");
        }

        var data;

        try {
            data = $.parseJSON(initialValue);
        } catch (err) {
            data = initialValue;
        }

        name = name.toLowerCase();
        resources[name] = new Resource(route, data, responseTemplate);

        return resources[name];
    }

    /**
     * Register a new list resource
     * @param {string}  name          The name of the resource. Must be a unique identifier
     * @param {string}  route         The route to bind the resource to
     * @param {*}       initialValue  The initial value to assign to the resource
     *
     * @returns {Resource}            The created resource.
     */
    function registerResourceList(name, route, initialValue, responseTemplate) {
        if (!name) {
            throw new Error("Cannot register resource. Name is required.");
        }

        if (!route && typeof initialValue === "undefined") {
            throw new Error("Cannot register resource. Route or initial value is required.");
        }

        if (resources[name]) {
            throw new Error("Resource '" + name + "' already exists.");
        }

        var data;

        try {
            data = $.parseJSON(initialValue);
        } catch (err) {
            data = initialValue;
        }

        name = name.toLowerCase();
        resources[name] = new ResourceList(route, data, responseTemplate);

        return resources[name];
    }

    /**
     * Receive a registered resource by its name
     * @param {string}  name    The name of the resource to receive
     *
     * @returns {Resource}      The resource
     */
    function getResource(name) {
        name = name.toLowerCase();

        if (!resources[name]) {
            throw new Error("Unkown resource: " + name);
        }

        return resources[name];
    }

    /**
     * Track changes of a given resource.
     * @param {string}      name        The name of the resource to watch
     * @param {function}    callback    The handler to call on each change
     */
    function watch(name, callback) {
        getResource(name).watch(callback);
    }

    /**
     * Bind a resource to a property of a vue instance.
     * @param {string}  name        The name of the resource to bind
     * @param {Vue}     vue         The vue instance
     * @param {string}  property    The property of the vue instance. Optional if the property name is equal to the resource name.
     */
    function bind(name, vue, property) {
        property = property || name;
        getResource(name).bind(vue, property);
    }

    /**
     * @class Observable
     * Automatically notify all attached listeners on any changes.
     */
    function Observable() {
        var _value;
        var _watchers = [];

        return {
            get value() {
                return _value;
            },
            set value(newValue) {
                for (var i = 0; i < _watchers.length; i++) {
                    var watcher = _watchers[i];

                    watcher.apply({}, [newValue, _value]);
                }
                _value = newValue;
            },
            watch: function watch(cb) {
                _watchers.push(cb);
            }
        };
    }

    /**
     * @class Resource
     * @param {string}  url              The url to bind the resource to
     * @param {string}  initialValue     The initial value to assign to the resource
     * @param {string}  responseTemplate The path to the response fields file
     */
    function Resource(url, initialValue, responseTemplate) {
        var data = new Observable();
        var ready = false;

        // initialize resource
        if (typeof initialValue !== "undefined") {
            // Initial value that was given by constructor
            data.value = initialValue;
            ready = true;
        } else if (url) {
            // If no initial value was given, get the value from the URL
            ApiService.get(url, { template: this.responseTemplate }).done(function (response) {
                data.value = response;
                ready = true;
            });
        } else {
            throw new Error("Cannot initialize resource.");
        }

        return {
            watch: watch,
            bind: bind,
            val: val,
            set: set,
            update: update,
            listen: listen
        };

        /**
         * Update this resource on a given event triggered by ApiService.
         * @param {string} event        The event to listen on
         * @param {string} usePayload   A property of the payload to assign to this resource.
         *                              The resource will be updated by GET request if not set.
         */
        function listen(event, usePayload) {
            ApiService.listen(event, function (payload) {
                if (usePayload) {
                    update(payload[usePayload]);
                } else {
                    update();
                }
            });
        }

        /**
         * Add handler to track changes on this resource
         * @param {function} cb     The callback to call on each change
         */
        function watch(cb) {
            if (typeof cb !== "function") {
                throw new Error("Callback expected but got '" + (typeof cb === "undefined" ? "undefined" : _typeof(cb)) + "'.");
            }
            data.watch(cb);
            if (ready) {
                cb.apply({}, [data.value, null]);
            }
        }

        /**
         * Bind a property of a vue instance to this resource
         * @param {Vue}     vue         The vue instance
         * @param {string}   property    The property of the vue instance
         */
        function bind(vue, property) {
            if (!vue) {
                throw new Error("Vue instance not set.");
            }

            if (!property) {
                throw new Error("Cannot bind undefined property.");
            }

            watch(function (newValue) {
                vue.$set(property, newValue);
            });
        }

        /**
         * Receive the current value of this resource
         * @returns {*}
         */
        function val() {
            return data.value;
        }

        /**
         * Set the value of the resource.
         * @param {*}   value   The value to set.
         * @returns {Deferred}  The PUT request to the url of the resource
         */
        function set(value) {
            if (url) {
                value.template = responseTemplate;
                return ApiService.put(url, value).done(function (response) {
                    data.value = response;
                });
            }

            var deferred = $.Deferred();

            data.value = value;
            deferred.resolve();
            return deferred;
        }

        /**
         * Update the value of the resource.
         * @param {*}           value   The new value to assign to this resource. Will receive current value from url if not set
         * @returns {Deferred}          The GET request to the url of the resource
         */
        function update(value) {
            if (value) {
                var deferred = $.Deferred();

                data.value = value;
                deferred.resolve();
                return deferred;
            } else if (url) {
                return ApiService.get(url, { template: responseTemplate }).done(function (response) {
                    data.value = response;
                });
            }

            throw new Error("Cannot update resource. Neither an URL nor a value is prodivded.");
        }
    }

    /**
     * @class ResourceList
     * @param {string}  url              The url to bind the resource to
     * @param {string}  initialValue     The initial value to assign to the resource
     * @param {string}  responseTemplate The path to the response fields file
     */
    function ResourceList(url, initialValue, responseTemplate) {
        var data = new Observable();
        var ready = false;

        if (url.charAt(url.length - 1) !== "/") {
            url += "/";
        }

        if (typeof initialValue !== "undefined") {
            data.value = initialValue;
            ready = true;
        } else if (url) {
            ApiService.get(url, { template: responseTemplate }).done(function (response) {
                data.value = response;
                ready = true;
            });
        } else {
            throw new Error("Cannot initialize resource.");
        }

        return {
            watch: watch,
            bind: bind,
            val: val,
            set: set,
            push: push,
            remove: remove,
            update: update,
            listen: listen
        };

        /**
         * Update this resource on a given event triggered by ApiService.
         * @param {string} event        The event to listen on
         * @param {string} usePayload   A property of the payload to assign to this resource.
         *                              The resource will be updated by GET request if not set.
         */
        function listen(event, usePayload) {
            ApiService.listen(event, function (payload) {
                if (usePayload) {
                    update(payload[usePayload]);
                } else {
                    update();
                }
            });
        }

        /**
         * Add handler to track changes on this resource
         * @param {function} cb     The callback to call on each change
         */
        function watch(cb) {
            if (typeof cb !== "function") {
                throw new Error("Callback expected but got '" + (typeof cb === "undefined" ? "undefined" : _typeof(cb)) + "'.");
            }
            data.watch(cb);

            if (ready) {
                cb.apply({}, [data.value, null]);
            }
        }

        /**
         * Bind a property of a vue instance to this resource
         * @param {Vue}     vue         The vue instance
         * @param {sting}   property    The property of the vue instance
         */
        function bind(vue, property) {
            if (!vue) {
                throw new Error("Vue instance not set.");
            }

            if (!property) {
                throw new Error("Cannot bind undefined property.");
            }

            watch(function (newValue) {
                vue.$set(property, newValue);
            });
        }

        /**
         * Receive the current value of this resource
         * @returns {*}
         */
        function val() {
            return data.value;
        }

        /**
         * Set the value of a single element of this resource.
         * @param {string|number}   key     The key of the element
         * @param {*}               value   The value to set.
         * @returns {Deferred}      The PUT request to the url of the resource
         */
        function set(key, value) {
            if (url) {
                value.template = responseTemplate;
                return ApiService.put(url + key, value).done(function (response) {
                    data.value = response;
                });
            }
            var deferred = $.Deferred();

            data.value = value;
            deferred.resolve();
            return deferred;
        }

        /**
         * Add a new element to this resource
         * @param {*}   value   The element to add
         * @returns {Deferred}  The POST request to the url of the resource
         */
        function push(value) {
            if (url) {
                value.template = responseTemplate;
                return ApiService.post(url, value).done(function (response) {
                    data.value = response;
                });
            }

            var deferred = $.Deferred();
            var list = data.value;

            list.push(value);
            data.value = list;

            deferred.resolve();
            return deferred;
        }

        /**
         * Remove an element from this resource
         * @param {string|number}   key     The key of the element
         * @returns {Deferred}              The DELETE request to the url of the resource
         */
        function remove(key) {
            if (url) {
                return ApiService.delete(url + key, { template: responseTemplate }).done(function (response) {
                    data.value = response;
                });
            }

            var deferred = $.Deferred();
            var list = data.value;

            list.splice(key, 1);
            data.value = list;

            deferred.resolve();
            return deferred;
        }

        /**
         * Update the value of the resource.
         * @param {*}           value   The new value to assign to this resource. Will receive current value from url if not set
         * @returns {Deferred}          The GET request to the url of the resource
         */
        function update(value) {
            if (value) {
                var deferred = $.Deferred();

                data.value = value;
                deferred.resolve();
                return deferred;
            }

            return ApiService.get(url, { template: responseTemplate }).done(function (response) {
                data.value = response;
            });
        }
    }
}(jQuery);

},{"services/ApiService":4}],8:[function(require,module,exports){
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
