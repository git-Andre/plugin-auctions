
// import AuctionBids from './components/auction/AuctionBids.vue';
// Vue.component('auctionbids', AuctionBids)
// var Vue = require("vue");

import Vue from "vue";

const AuctionBids = require("./components/auction/AuctionBids.js");
//

vueApp = new Vue({
    el: "#addAuctionVue",
    components: {
        AuctionBids
    },
    data: {

    }

});
// module.export = {
//     components: {
//         "auction-bids": AuctionBids
//     }
// };

