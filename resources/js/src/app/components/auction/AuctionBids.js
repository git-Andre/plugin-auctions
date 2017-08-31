// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    // name: "auctionbids",
    props: [
        "template",
        "auction",
        "maxCustomerBid",
        "isActive"
    ],
    data: function data() {
        return {
            remainingTime: "this.now",
            minBid: 66.22,
            test: this.auctionParse()
        };
    },
    created() {
        this.$options.template = this.template;


    },
    methods: {
        addBid() {
            alert('addBid');
        },
        auctionParse() {
            var auction = JSON.parse(this.auction);
            return auction;
        }

    }
} );
