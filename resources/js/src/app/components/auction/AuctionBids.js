// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    // name: "auctionbids",
    props: [
        "template",
        "auctionData",
        "auction",
        "bidderList",
    ],
    data: function data() {
        return {
            minBid: this.bidderList.bidPrice,
            testId: this.auction.id,
            testBidder: this.bidderList,
            isInputValid: false
        };
    },
    created() {
        this.$options.template = this.template;
        this.auction = JSON.parse(this.auctionData);
        this.bidderList = auction.bidderList;

    },
    methods: {
        addBid() {
            alert(this.auction.bidderlist[1]);
        },
    }
} );
