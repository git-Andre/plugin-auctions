(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * accounting.js v0.4.1
 * Copyright 2014 Open Exchange Rates
 *
 * Freely distributable under the MIT license.
 * Portions of accounting.js are inspired or borrowed from underscore.js
 *
 * Full details and documentation:
 * http://openexchangerates.github.io/accounting.js/
 */

(function(root, undefined) {

	/* --- Setup --- */

	// Create the local library object, to be exported or referenced globally later
	var lib = {};

	// Current version
	lib.version = '0.4.1';


	/* --- Exposed settings --- */

	// The library's settings configuration object. Contains default parameters for
	// currency and number formatting
	lib.settings = {
		currency: {
			symbol : "$",		// default currency symbol is '$'
			format : "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)
			decimal : ".",		// decimal point separator
			thousand : ",",		// thousands separator
			precision : 2,		// decimal places
			grouping : 3		// digit grouping (not implemented yet)
		},
		number: {
			precision : 0,		// default precision on numbers is 0
			grouping : 3,		// digit grouping (not implemented yet)
			thousand : ",",
			decimal : "."
		}
	};


	/* --- Internal Helper Methods --- */

	// Store reference to possibly-available ECMAScript 5 methods for later
	var nativeMap = Array.prototype.map,
		nativeIsArray = Array.isArray,
		toString = Object.prototype.toString;

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js
	 */
	function isString(obj) {
		return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
	}

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js, delegates to ECMA5's native Array.isArray
	 */
	function isArray(obj) {
		return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';
	}

	/**
	 * Tests whether supplied parameter is a true object
	 */
	function isObject(obj) {
		return obj && toString.call(obj) === '[object Object]';
	}

	/**
	 * Extends an object with a defaults object, similar to underscore's _.defaults
	 *
	 * Used for abstracting parameter handling from API methods
	 */
	function defaults(object, defs) {
		var key;
		object = object || {};
		defs = defs || {};
		// Iterate over object non-prototype properties:
		for (key in defs) {
			if (defs.hasOwnProperty(key)) {
				// Replace values with defaults only if undefined (allow empty/zero values):
				if (object[key] == null) object[key] = defs[key];
			}
		}
		return object;
	}

	/**
	 * Implementation of `Array.map()` for iteration loops
	 *
	 * Returns a new Array as a result of calling `iterator` on each array value.
	 * Defers to native Array.map if available
	 */
	function map(obj, iterator, context) {
		var results = [], i, j;

		if (!obj) return results;

		// Use native .map method if it exists:
		if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);

		// Fallback for native .map:
		for (i = 0, j = obj.length; i < j; i++ ) {
			results[i] = iterator.call(context, obj[i], i, obj);
		}
		return results;
	}

	/**
	 * Check and normalise the value of precision (must be positive integer)
	 */
	function checkPrecision(val, base) {
		val = Math.round(Math.abs(val));
		return isNaN(val)? base : val;
	}


	/**
	 * Parses a format string or object and returns format obj for use in rendering
	 *
	 * `format` is either a string with the default (positive) format, or object
	 * containing `pos` (required), `neg` and `zero` values (or a function returning
	 * either a string or object)
	 *
	 * Either string or format.pos must contain "%v" (value) to be valid
	 */
	function checkCurrencyFormat(format) {
		var defaults = lib.settings.currency.format;

		// Allow function as format parameter (should return string or object):
		if ( typeof format === "function" ) format = format();

		// Format can be a string, in which case `value` ("%v") must be present:
		if ( isString( format ) && format.match("%v") ) {

			// Create and return positive, negative and zero formats:
			return {
				pos : format,
				neg : format.replace("-", "").replace("%v", "-%v"),
				zero : format
			};

		// If no format, or object is missing valid positive value, use defaults:
		} else if ( !format || !format.pos || !format.pos.match("%v") ) {

			// If defaults is a string, casts it to an object for faster checking next time:
			return ( !isString( defaults ) ) ? defaults : lib.settings.currency.format = {
				pos : defaults,
				neg : defaults.replace("%v", "-%v"),
				zero : defaults
			};

		}
		// Otherwise, assume format was fine:
		return format;
	}


	/* --- API Methods --- */

	/**
	 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value
	 * Alias: `accounting.parse(string)`
	 *
	 * Decimal must be included in the regular expression to match floats (defaults to
	 * accounting.settings.number.decimal), so if the number uses a non-standard decimal 
	 * separator, provide it as the second argument.
	 *
	 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)
	 *
	 * Doesn't throw any errors (`NaN`s become 0) but this may change in future
	 */
	var unformat = lib.unformat = lib.parse = function(value, decimal) {
		// Recursively unformat arrays:
		if (isArray(value)) {
			return map(value, function(val) {
				return unformat(val, decimal);
			});
		}

		// Fails silently (need decent errors):
		value = value || 0;

		// Return the value as-is if it's already a number:
		if (typeof value === "number") return value;

		// Default decimal point comes from settings, but could be set to eg. "," in opts:
		decimal = decimal || lib.settings.number.decimal;

		 // Build regex to strip out everything except digits, decimal point and minus sign:
		var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
			unformatted = parseFloat(
				("" + value)
				.replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
				.replace(regex, '')         // strip out any cruft
				.replace(decimal, '.')      // make sure decimal point is standard
			);

		// This will fail silently which may cause trouble, let's wait and see:
		return !isNaN(unformatted) ? unformatted : 0;
	};


	/**
	 * Implementation of toFixed() that treats floats more like decimals
	 *
	 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
	 * problems for accounting- and finance-related software.
	 */
	var toFixed = lib.toFixed = function(value, precision) {
		precision = checkPrecision(precision, lib.settings.number.precision);
		var power = Math.pow(10, precision);

		// Multiply up by precision, round accurately, then divide and use native toFixed():
		return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);
	};


	/**
	 * Format a number, with comma-separated thousands and custom precision/decimal places
	 * Alias: `accounting.format()`
	 *
	 * Localise by overriding the precision and thousand / decimal separators
	 * 2nd parameter `precision` can be an object matching `settings.number`
	 */
	var formatNumber = lib.formatNumber = lib.format = function(number, precision, thousand, decimal) {
		// Resursively format arrays:
		if (isArray(number)) {
			return map(number, function(val) {
				return formatNumber(val, precision, thousand, decimal);
			});
		}

		// Clean up number:
		number = unformat(number);

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(precision) ? precision : {
					precision : precision,
					thousand : thousand,
					decimal : decimal
				}),
				lib.settings.number
			),

			// Clean up precision
			usePrecision = checkPrecision(opts.precision),

			// Do some calc:
			negative = number < 0 ? "-" : "",
			base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
			mod = base.length > 3 ? base.length % 3 : 0;

		// Format the number:
		return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
	};


	/**
	 * Format a number into currency
	 *
	 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
	 * defaults: (0, "$", 2, ",", ".", "%s%v")
	 *
	 * Localise by overriding the symbol, precision, thousand / decimal separators and format
	 * Second param can be an object matching `settings.currency` which is the easiest way.
	 *
	 * To do: tidy up the parameters
	 */
	var formatMoney = lib.formatMoney = function(number, symbol, precision, thousand, decimal, format) {
		// Resursively format arrays:
		if (isArray(number)) {
			return map(number, function(val){
				return formatMoney(val, symbol, precision, thousand, decimal, format);
			});
		}

		// Clean up number:
		number = unformat(number);

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(symbol) ? symbol : {
					symbol : symbol,
					precision : precision,
					thousand : thousand,
					decimal : decimal,
					format : format
				}),
				lib.settings.currency
			),

			// Check format (returns object with pos, neg and zero):
			formats = checkCurrencyFormat(opts.format),

			// Choose which format to use for this value:
			useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;

		// Return with currency symbol added:
		return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
	};


	/**
	 * Format a list of numbers into an accounting column, padding with whitespace
	 * to line up currency symbols, thousand separators and decimals places
	 *
	 * List should be an array of numbers
	 * Second parameter can be an object containing keys that match the params
	 *
	 * Returns array of accouting-formatted number strings of same length
	 *
	 * NB: `white-space:pre` CSS rule is required on the list container to prevent
	 * browsers from collapsing the whitespace in the output strings.
	 */
	lib.formatColumn = function(list, symbol, precision, thousand, decimal, format) {
		if (!list) return [];

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(symbol) ? symbol : {
					symbol : symbol,
					precision : precision,
					thousand : thousand,
					decimal : decimal,
					format : format
				}),
				lib.settings.currency
			),

			// Check format (returns object with pos, neg and zero), only need pos for now:
			formats = checkCurrencyFormat(opts.format),

			// Whether to pad at start of string or after currency symbol:
			padAfterSymbol = formats.pos.indexOf("%s") < formats.pos.indexOf("%v") ? true : false,

			// Store value for the length of the longest string in the column:
			maxLength = 0,

			// Format the list according to options, store the length of the longest string:
			formatted = map(list, function(val, i) {
				if (isArray(val)) {
					// Recursively format columns if list is a multi-dimensional array:
					return lib.formatColumn(val, opts);
				} else {
					// Clean up the value
					val = unformat(val);

					// Choose which format to use for this value (pos, neg or zero):
					var useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,

						// Format this value, push into formatted list and save the length:
						fVal = useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal));

					if (fVal.length > maxLength) maxLength = fVal.length;
					return fVal;
				}
			});

		// Pad each number in the list and send back the column of numbers:
		return map(formatted, function(val, i) {
			// Only if this is a string (not a nested array, which would have already been padded):
			if (isString(val) && val.length < maxLength) {
				// Depending on symbol position, pad after symbol or at index 0:
				return padAfterSymbol ? val.replace(opts.symbol, opts.symbol+(new Array(maxLength - val.length + 1).join(" "))) : (new Array(maxLength - val.length + 1).join(" ")) + val;
			}
			return val;
		});
	};


	/* --- Module Definition --- */

	// Export accounting for CommonJS. If being loaded as an AMD module, define it as such.
	// Otherwise, just add `accounting` to the global object
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = lib;
		}
		exports.accounting = lib;
	} else if (typeof define === 'function' && define.amd) {
		// Return the library as an AMD module:
		define([], function() {
			return lib;
		});
	} else {
		// Use accounting.noConflict to restore `accounting` back to its original value.
		// Returns a reference to the library's `accounting` object;
		// e.g. `var numbers = accounting.noConflict();`
		lib.noConflict = (function(oldAccounting) {
			return function() {
				// Reset the value of the root's `accounting` variable:
				root.accounting = oldAccounting;
				// Delete the noConflict method:
				lib.noConflict = undefined;
				// Return reference to the library to re-assign it:
				return lib;
			};
		})(root.accounting);

		// Declare `fx` on the root (global/window) object:
		root['accounting'] = lib;
	}

	// Root will be `window` in browser or `global` on the server:
}(this));

},{}],2:[function(require,module,exports){
var currencySymbolMap = require('./map');

var symbolCurrencyMap = {};
for (var key in currencySymbolMap) {
  if (currencySymbolMap.hasOwnProperty(key)) {
    var currency = key;
    var symbol = currencySymbolMap[currency];
    symbolCurrencyMap[symbol] = currency;
  }
}

function getSymbolFromCurrency(currencyCode) {
  if (currencySymbolMap.hasOwnProperty(currencyCode)) {
    return currencySymbolMap[currencyCode];
  } else {
    return undefined;
  }
}

function getCurrencyFromSymbol(symbol) {
  if (symbolCurrencyMap.hasOwnProperty(symbol)) {
    return symbolCurrencyMap[symbol];
  } else {
    return undefined;
  }
}

function getSymbol(currencyCode) {
  //Deprecated
  var symbol = getSymbolFromCurrency(currencyCode);
  return symbol !== undefined ? symbol : '?';
}

module.exports = getSymbol; //Backward compatibility
module.exports.getSymbolFromCurrency = getSymbolFromCurrency;
module.exports.getCurrencyFromSymbol = getCurrencyFromSymbol;
module.exports.symbolCurrencyMap = symbolCurrencyMap;
module.exports.currencySymbolMap = currencySymbolMap;

},{"./map":3}],3:[function(require,module,exports){
module.exports =
{ "ALL": "L"
, "AFN": "؋"
, "ARS": "$"
, "AWG": "ƒ"
, "AUD": "$"
, "AZN": "₼"
, "BSD": "$"
, "BBD": "$"
, "BYR": "p."
, "BZD": "BZ$"
, "BMD": "$"
, "BOB": "Bs."
, "BAM": "KM"
, "BWP": "P"
, "BGN": "лв"
, "BRL": "R$"
, "BND": "$"
, "KHR": "៛"
, "CAD": "$"
, "KYD": "$"
, "CLP": "$"
, "CNY": "¥"
, "COP": "$"
, "CRC": "₡"
, "HRK": "kn"
, "CUP": "₱"
, "CZK": "Kč"
, "DKK": "kr"
, "DOP": "RD$"
, "XCD": "$"
, "EGP": "£"
, "SVC": "$"
, "EEK": "kr"
, "EUR": "€"
, "FKP": "£"
, "FJD": "$"
, "GHC": "₵"
, "GIP": "£"
, "GTQ": "Q"
, "GGP": "£"
, "GYD": "$"
, "HNL": "L"
, "HKD": "$"
, "HUF": "Ft"
, "ISK": "kr"
, "INR": "₹"
, "IDR": "Rp"
, "IRR": "﷼"
, "IMP": "£"
, "ILS": "₪"
, "JMD": "J$"
, "JPY": "¥"
, "JEP": "£"
, "KES": "KSh"
, "KZT": "лв"
, "KPW": "₩"
, "KRW": "₩"
, "KGS": "лв"
, "LAK": "₭"
, "LVL": "Ls"
, "LBP": "£"
, "LRD": "$"
, "LTL": "Lt"
, "MKD": "ден"
, "MYR": "RM"
, "MUR": "₨"
, "MXN": "$"
, "MNT": "₮"
, "MZN": "MT"
, "NAD": "$"
, "NPR": "₨"
, "ANG": "ƒ"
, "NZD": "$"
, "NIO": "C$"
, "NGN": "₦"
, "NOK": "kr"
, "OMR": "﷼"
, "PKR": "₨"
, "PAB": "B/."
, "PYG": "Gs"
, "PEN": "S/."
, "PHP": "₱"
, "PLN": "zł"
, "QAR": "﷼"
, "RON": "lei"
, "RUB": "₽"
, "SHP": "£"
, "SAR": "﷼"
, "RSD": "Дин."
, "SCR": "₨"
, "SGD": "$"
, "SBD": "$"
, "SOS": "S"
, "ZAR": "R"
, "LKR": "₨"
, "SEK": "kr"
, "CHF": "CHF"
, "SRD": "$"
, "SYP": "£"
, "TZS": "TSh"
, "TWD": "NT$"
, "THB": "฿"
, "TTD": "TT$"
, "TRY": ""
, "TRL": "₤"
, "TVD": "$"
, "UGX": "USh"
, "UAH": "₴"
, "GBP": "£"
, "USD": "$"
, "UYU": "$U"
, "UZS": "лв"
, "VEF": "Bs"
, "VND": "₫"
, "YER": "﷼"
, "ZWD": "Z$"
}

},{}],4:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var ResourceService = require("services/ResourceService");

Vue.component("auction-bids", {

    props: ["bidderList", "itemId", "item"],
    data: function data() {
        return {
            // itemId: this.itemId,
            // bidderList: this.bidderList,
        };
    },
    created: function created() {},
    ready: function ready() {
        this.itemId = item.itemId;
        this.bidderList = item.bidderList;
        alert(this.itemId);
        console.log('this.itemId: ' + this.itemId);
        console.log('data: ' + this.bidderList);
    }

    // props: [
    //     "template",
    //     "wishListIds"
    // ],
    //
    // data()
    // {
    //     return {
    //         wishListItems: [],
    //         isLoading: false,
    //         wishListCount: {}
    //     };
    // },
    //
    // created()
    // {
    //     this.$options.template = this.template;
    // },
    //
    // ready()
    // {
    //     ResourceService.bind("wishListCount", this);
    //
    //     this.getWishListItems();
    // },
    //
    // methods:
    // {
    //     removeWishListItem(wishListItem, index)
    //     {
    //         ApiService.delete("/rest/io/itemWishList/" + wishListItem.data.variation.id)
    //             .done(data =>
    //             {
    //                 // remove this in done to prevent no items in this list label to be shown
    //                 this.wishListIds.splice(this.wishListIds.indexOf(wishListItem.data.variation.id), 1);
    //                 this.updateWatchListCount(parseInt(this.wishListCount.count) - 1);
    //
    //             })
    //             .fail(error =>
    //             {
    //                 this.wishListItems.splice(index, 0, wishListItem);
    //             });
    //
    //         this.wishListItems.splice(index, 1);
    //     },
    //
    //     getWishListItems()
    //     {
    //         if (this.wishListIds[0])
    //         {
    //             this.isLoading = true;
    //
    //             ApiService.get("/rest/io/variations/", {variationIds: this.wishListIds, template: "Ceres::WishList.WishList"})
    //                 .done(data =>
    //                 {
    //                     this.wishListItems = data.documents;
    //
    //                     this.isLoading = false;
    //                 })
    //                 .fail(() =>
    //                 {
    //                     this.isLoading = false;
    //                 });
    //         }
    //     },
    //
    //     updateWatchListCount(count)
    //     {
    //         if (count >= 0)
    //         {
    //             ResourceService.getResource("wishListCount").set({count: count});
    //         }
    //     }
    // }

});

},{"services/ApiService":17,"services/ResourceService":19}],5:[function(require,module,exports){
"use strict";

var ApiService = require("services/ApiService");
var ResourceService = require("services/ResourceService");

Vue.component("wish-list", {

    props: ["template", "wishListIds"],

    data: function data() {
        return {
            wishListItems: [],
            isLoading: false,
            wishListCount: {}
        };
    },
    created: function created() {
        this.$options.template = this.template;
    },
    ready: function ready() {
        ResourceService.bind("wishListCount", this);

        this.getWishListItems();
    },


    methods: {
        removeWishListItem: function removeWishListItem(wishListItem, index) {
            var _this = this;

            ApiService.delete("/rest/io/itemWishList/" + wishListItem.data.variation.id).done(function (data) {
                // remove this in done to prevent no items in this list label to be shown
                _this.wishListIds.splice(_this.wishListIds.indexOf(wishListItem.data.variation.id), 1);
                _this.updateWatchListCount(parseInt(_this.wishListCount.count) - 1);
            }).fail(function (error) {
                _this.wishListItems.splice(index, 0, wishListItem);
            });

            this.wishListItems.splice(index, 1);
        },
        getWishListItems: function getWishListItems() {
            var _this2 = this;

            if (this.wishListIds[0]) {
                this.isLoading = true;

                ApiService.get("/rest/io/variations/", { variationIds: this.wishListIds, template: "Ceres::WishList.WishList" }).done(function (data) {
                    _this2.wishListItems = data.documents;

                    _this2.isLoading = false;
                }).fail(function () {
                    _this2.isLoading = false;
                });
            }
        },
        updateWatchListCount: function updateWatchListCount(count) {
            if (count >= 0) {
                ResourceService.getResource("wishListCount").set({ count: count });
            }
        }
    }
});

},{"services/ApiService":17,"services/ResourceService":19}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var exceptionMap = exports.exceptionMap = new Map([["1", "basketItemNotAdded"], ["2", "basketNotEnoughStockItem"]]);

exports.default = exceptionMap;

},{}],7:[function(require,module,exports){
"use strict";

Vue.filter("arrayFirst", function (array) {
    return array[0];
});

},{}],8:[function(require,module,exports){
"use strict";

Vue.filter("attachText", function (item, text) {
    return text + item;
});

},{}],9:[function(require,module,exports){
"use strict";

var ResourceService = require("services/ResourceService");
var currencySymbolMap = require("currency-symbol-map");
var accounting = require("accounting");

Vue.filter("currency", function (price, customCurrency) {
    var basket = ResourceService.getResource("basket").val();

    var currency = customCurrency || basket.currency;

    if (currency) {
        var currencySymbol = currencySymbolMap.getSymbolFromCurrency(currency);

        if (currencySymbol) {
            currency = currencySymbol;
        }
    }

    // (%v = value, %s = symbol)
    var options = {
        symbol: currency,
        decimal: ",",
        thousand: ".",
        precision: 2,
        format: "%v %s"
    };

    return accounting.formatMoney(price, options);
});

},{"accounting":1,"currency-symbol-map":2,"services/ResourceService":19}],10:[function(require,module,exports){
"use strict";

// for docs see https://github.com/brockpetrie/vue-moment

var dateFilter = function dateFilter() {
    var args = Array.prototype.slice.call(arguments);
    var input = args.shift();
    var date;

    if (isNaN(new Date(input).getTime())) {
        return input;
    }

    if (Array.isArray(input) && typeof input[0] === "string") {
        // If input is array, assume we're being passed a format pattern to parse against.
        // Format pattern will accept an array of potential formats to parse against.
        // Date string should be at [0], format pattern(s) should be at [1]
        date = moment(string = input[0], formats = input[1], true);
    } else {
        // Otherwise, throw the input at moment and see what happens...
        date = moment(input);
    }

    if (!date.isValid()) {
        // Log a warning if moment couldn't reconcile the input. Better than throwing an error?
        console.warn("Could not build a valid `moment` object from input.");
        return input;
    }

    function parse() {
        var args = Array.prototype.slice.call(arguments);
        var method = args.shift();

        switch (method) {
            case "add":

                // Mutates the original moment by adding time.
                // http://momentjs.com/docs/#/manipulating/add/

                var addends = args.shift().split(",").map(Function.prototype.call, String.prototype.trim);

                obj = {};
                for (var aId = 0; aId < addends.length; aId++) {
                    var addend = addends[aId].split(" ");

                    obj[addend[1]] = addend[0];
                }
                date = date.add(obj);
                break;

            case "subtract":

                // Mutates the original moment by subtracting time.
                // http://momentjs.com/docs/#/manipulating/subtract/

                var subtrahends = args.shift().split(",").map(Function.prototype.call, String.prototype.trim);

                obj = {};
                for (var sId = 0; sId < subtrahends.length; sId++) {
                    var subtrahend = subtrahends[sId].split(" ");

                    obj[subtrahend[1]] = subtrahend[0];
                }
                date = date.subtract(obj);
                break;

            case "from":

                // Display a moment in relative time, either from now or from a specified date.
                // http://momentjs.com/docs/#/displaying/fromnow/

                var from = "now";

                if (args[0] === "now") args.shift();

                if (moment(args[0]).isValid()) {
                    // If valid, assume it is a date we want the output computed against.
                    from = moment(args.shift());
                }

                var removeSuffix = false;

                if (args[0] === true) {
                    args.shift();
                    removeSuffix = true;
                }

                if (from != "now") {
                    date = date.from(from, removeSuffix);
                    break;
                }

                date = date.fromNow(removeSuffix);
                break;

            case "calendar":

                // Formats a date with different strings depending on how close to a certain date (today by default) the date is.
                // http://momentjs.com/docs/#/displaying/calendar-time/

                var referenceTime = moment();

                if (moment(args[0]).isValid()) {
                    // If valid, assume it is a date we want the output computed against.
                    referenceTime = moment(args.shift());
                }

                date = date.calendar(referenceTime);
                break;

            default:
                // Format
                // Formats a date by taking a string of tokens and replacing them with their corresponding values.
                // http://momentjs.com/docs/#/displaying/format/

                var format = method;

                date = date.format(format);
        }

        if (args.length) parse.apply(parse, args);
    }

    parse.apply(parse, args);

    return date;
};

Vue.filter("moment", dateFilter);
Vue.filter("date", dateFilter);

},{}],11:[function(require,module,exports){
"use strict";

Vue.filter("itemImage", function (itemImages, highestPosition) {
    if (itemImages.length === 0) {
        return "";
    }

    if (itemImages.length === 1) {
        return itemImages[0].url;
    }

    if (highestPosition) {
        return itemImages.reduce(function (prev, current) {
            return prev.position > current.position ? prev : current;
        }).url;
    }

    return itemImages.reduce(function (prev, current) {
        return prev.position < current.position ? prev : current;
    }).url;
});

},{}],12:[function(require,module,exports){
"use strict";

Vue.filter("itemImages", function (images, accessor) {
    var imageUrls = [];
    var imagesAccessor = "all";

    if (images.variation && images.variation.length) {
        imagesAccessor = "variation";
    }

    for (var i in images[imagesAccessor]) {
        var imageUrl = images[imagesAccessor][i][accessor];

        imageUrls.push({ url: imageUrl, position: images[imagesAccessor][i].position });
    }

    return imageUrls;
});

},{}],13:[function(require,module,exports){
"use strict";

Vue.filter("itemName", function (item, selectedName) {
    if (selectedName == 0 && item.name1 !== "") {
        return item.name1;
    } else if (selectedName == 1 && item.name2 !== "") {
        return item.name2;
    } else if (selectedName == 2 && item.name3 !== "") {
        return item.name3;
    }

    return item.name1;
});

},{}],14:[function(require,module,exports){
"use strict";

Vue.filter("itemURL", function (item) {
    var enableOldUrlPattern = App.config.enableOldUrlPattern === "true";
    var urlPath = item.texts.urlPath;

    var link = "/";

    if (urlPath && urlPath.length) {
        link += urlPath;

        link += enableOldUrlPattern ? "/" : "_";
    }

    if (enableOldUrlPattern) {
        return link + "a-" + item.item.id;
    }

    return link + item.item.id + "_" + item.variation.id;
});

},{}],15:[function(require,module,exports){
"use strict";

Vue.filter("propertySurcharge", function (properties, propertyId) {
    var property = properties.find(function (prop) {
        return prop.property.id === propertyId;
    });

    if (property) {
        if (property.surcharge > 0) {
            return property.surcharge;
        } else if (property.property.surcharge > 0) {
            return property.property.surcharge;
        }
    }

    return 0;
});

},{}],16:[function(require,module,exports){
"use strict";

Vue.filter("truncate", function (string, value) {
    if (string.length > value) {
        return string.substring(0, value) + "...";
    }
    return string;
});

},{}],17:[function(require,module,exports){
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

},{"services/NotificationService":18,"services/WaitScreenService":20}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"services/ApiService":17}],20:[function(require,module,exports){
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

},{}]},{},[4,5,6,7,8,9,10,11,12,13,14,15,16])


// Frontend end scripts
// eslint-disable-next-line
// import Vue from 'vue'
// import App from './App.vue'
// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

import Vue from 'vue'
import App from './App.vue'


new Vue({
            el: '#body',
            render: h => h(App)
        })
// var init = (function($, window, document)
// {
//
//     function CeresMain()
//     {
//         $("#btnMainMenuToggler").click(function()
//         {
//             $(".mobile-navigation").toggleClass("open");
//             $("body").toggleClass("menu-is-visible");
//         });
//
//         $(window).scroll(function()
//         {
//             if ($(".wrapper-main").hasClass("isSticky"))
//             {
//                 if ($(this).scrollTop() > 1)
//                 {
//                     $(".wrapper-main").addClass("sticky");
//                 }
//                 else
//                 {
//                     $(".wrapper-main").removeClass("sticky");
//                 }
//             }
//         });
//
//         // init bootstrap tooltips
//         $("[data-toggle=\"tooltip\"]").tooltip();
//
//         // Replace all SVG images with inline SVG, class: svg
//         $("img[src$=\".svg\"]").each(function()
//         {
//             var $img = jQuery(this);
//             var imgURL = $img.attr("src");
//             var attributes = $img.prop("attributes");
//
//             $.get(imgURL, function(data)
//             {
//                 // Get the SVG tag, ignore the rest
//                 var $svg = jQuery(data).find("svg");
//
//                 // Remove any invalid XML tags
//                 $svg = $svg.removeAttr("xmlns:a");
//
//                 // Loop through IMG attributes and apply on SVG
//                 $.each(attributes, function()
//                 {
//                     $svg.attr(this.name, this.value);
//                 });
//
//                 // Replace IMG with SVG
//                 $img.replaceWith($svg);
//             }, "xml");
//         });
//
//         // Sticky sidebar single item
//         if (window.matchMedia("(min-width: 768px)").matches)
//         {
//             var $singleRightside = $(".single-rightside");
//             var $headHeight = $(".top-bar").height();
//
//             $singleRightside.stick_in_parent({offset_top: $headHeight + 10});
//
//             $singleRightside.on("sticky_kit:bottom", function()
//             {
//                 $(this).parent().css("position", "static");
//             })
//                 .on("sticky_kit:unbottom", function()
//                 {
//                     $(this).parent().css("position", "relative");
//                 });
//         }
//
//         var $toggleListView = $(".toggle-list-view");
//         var $mainNavbarCollapse = $("#mainNavbarCollapse");
//
//         setTimeout(function()
//         {
//             var $toggleBasketPreview = $("#toggleBasketPreview, #closeBasketPreview");
//
//             $toggleBasketPreview.on("click", function(evt)
//             {
//                 evt.preventDefault();
//                 evt.stopPropagation();
//                 $("body").toggleClass("open-right");
//             });
//         }, 1);
//
//         $(document).on("click", "body.open-right", function(evt)
//         {
//             if ($("body").hasClass("open-right"))
//             {
//                 if ((evt.target != $(".basket-preview")) && ($(evt.target).parents(".basket-preview").length <= 0))
//                 {
//                     evt.preventDefault();
//                     $("body").toggleClass("open-right");
//                 }
//             }
//         });
//
//         $("#to-top").on("click", function()
//         {
//             $("html, body").animate({scrollTop: 0}, "slow");
//         });
//
//         $("#searchBox").on("show.bs.collapse", function()
//         {
//             $("#countrySettings").collapse("hide");
//         });
//
//         $("#countrySettings").on("show.bs.collapse", function()
//         {
//             $("#searchBox").collapse("hide");
//         });
//
//         $toggleListView.on("click", function(evt)
//         {
//             evt.preventDefault();
//
//             // toggle it's own state
//             $toggleListView.toggleClass("grid");
//
//             // toggle internal style of thumbs
//             $(".product-list, .cmp-product-thumb").toggleClass("grid");
//         });
//
//         $mainNavbarCollapse.collapse("hide");
//
//         // Add click listener outside the navigation to close it
//         $mainNavbarCollapse.on("show.bs.collapse", function()
//         {
//             $(".main").one("click", closeNav);
//         });
//
//         $mainNavbarCollapse.on("hide.bs.collapse", function()
//         {
//             $(".main").off("click", closeNav);
//         });
//
//         function closeNav()
//         {
//             $("#mainNavbarCollapse").collapse("hide");
//         }
//
//         $(document).ready(function()
//         {
//             var offset = 250;
//             var duration = 300;
//
//             $(window).scroll(function()
//             {
//                 if ($(this).scrollTop() > offset)
//                 {
//                     $(".back-to-top").fadeIn(duration);
//                     $(".back-to-top-center").fadeIn(duration);
//                 }
//                 else
//                 {
//                     $(".back-to-top").fadeOut(duration);
//                     $(".back-to-top-center").fadeOut(duration);
//                 }
//             });
//
//             $(".back-to-top").click(function(event)
//             {
//                 event.preventDefault();
//
//                 $("html, body").animate({scrollTop: 0}, duration);
//
//                 return false;
//             });
//
//             $(".back-to-top-center").click(function(event)
//             {
//                 event.preventDefault();
//
//                 $("html, body").animate({scrollTop: 0}, duration);
//
//                 return false;
//             });
//         });
//     }
//
//     window.CeresMain = new CeresMain();
//
// })(jQuery, window, document);

//# sourceMappingURL=auction-app.js.map
