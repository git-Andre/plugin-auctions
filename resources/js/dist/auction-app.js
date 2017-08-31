(function e(t, n, r) {
    function s(o, u) {
        if ( !n[o] ) {
            if ( !t[o] ) {
                var a = typeof require == "function" && require;
                if ( !u && a ) return a( o, !0 );
                if ( i ) return i( o, !0 );
                var f = new Error( "Cannot find module '" + o + "'" );
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = { exports: {} };
            t[o][0].call( l.exports, function (e) {
                var n = t[o][1][e];
                return s( n ? n : e )
            }, l, l.exports, e, t, n, r )
        }
        return n[o].exports
    }

    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s( r[o] );
    return s
})( {
        1: [
            function (require, module, exports) {
                "use strict";

// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");
// Vue.config.devtools = true

                Vue.component( "auction-bids", {
                    // name: "auctionbids",
                    props: ["template", "auction", "isActive"],
                    data: function data() {
                        return {
                            remainingTime: "this.now",
                            minBid: "this.auction",
                            test: this.auction
                        };
                    },
                    created: function created() {
                        this.$options.template = this.template;
                    }
                } );

            }, {}
        ]
    }, {}, [1] )

// Vue.config.devtools = true
//
// vueApp = new Vue( {
//                       el: "#addAuctionVue",
//
//                       components: {
//                           // "auction-test": AuctionTest
//                       },
//                       props: [
//                       ],
//                       data: function () {
//                           return {
//                           }
//                       },
//                       computed() {
//                       }
//                   } );

// import {AuctionBids} from './components/auction/AuctionBids';
//
// export default {
//     name: 'auction-bids',
//     components: {
//         auctionBids: AuctionBids
//     }
// }
//# sourceMappingURL=auction-app.js.map
