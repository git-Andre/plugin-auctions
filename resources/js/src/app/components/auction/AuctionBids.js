// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    // name: "auctionbids",
    props: [
        "template",
        "auctionData",
        "auction",
        "maxCustomerBid",
        "isInputValid"
    ],
    data: function data() {
        return {
            minBid: 66.22,
            test: this.auction.id,
            isInputValid: false
        };
    },
    created() {
        this.$options.template = this.template;
        this.auction = JSON.parse(this.auctionData);
    },
    methods: {
        addBid() {
            alert(this.auction.bidderlist[1]);
        },
    }
} );
