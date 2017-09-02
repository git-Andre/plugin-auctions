// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    // name: "auctionbids",
    props: [
        "template",
        "biddata",
        "auction",
        "bidderList",
        "auctionId"
    ],
    data: function data() {
        return {
            // minBid: this.bidderList[0].bidPrice,
            testId: this.auction,
            // testBidder: this.bidderList,
            isInputValid: false
        };
    },
    created() {
        this.$options.template = this.template;
        this.auction = JSON.parse(this.biddata);
        this.biddata = null;   /* all dataInput-handling is stupid, but I'm a js-amateur..*/
        this.auctionId = this.auction['id'];
    },
    methods: {
        addBid() {
            // var test=  this.auction['id']
            // var test =  this.auction.bidderList[1].bidderName;
            // var test = this.bidderListLastPrice

            var test = this.bidderListLastPrice
            // auction.bidderList.last
            // auction.bidderList.length

            alert(this.auctionId + ' --- test: ' + test);
        }
    },
    computed: {
        bidderListLastPrice() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice
        }
    }
} );
