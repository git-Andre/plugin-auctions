// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

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
    created() {
        this.$options.template = this.template;
    },

} );
