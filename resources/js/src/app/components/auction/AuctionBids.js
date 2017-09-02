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
            // testId: this.auction,
            // testBidder: this.bidderList,
            isInputValid: maxCustomerBid < this.bidderListLastBidPrice + 1,
            // maxCustomerBid
        };
    },
    created() {
        this.$options.template = this.template;
        this.auction           = JSON.parse( this.biddata );
        this.biddata           = null;
        /* all dataInput-handling is stupid, but I'm a js-amateur..*/
        this.auctionId = this.auction['id'];
    },
    methods: {
        addBid() {
            // var test=  this.auction['id']
            // var test =  this.auction.bidderList[1].bidderName;
            // var test = this.bidderListLastPrice

            // alert('this.bidderListLastBidPrice: ' + this.bidderListLastBidPrice + '<br/>');
            // alert('this.bidderListLastCustomerMaxBid: ' + this.bidderListLastCustomerMaxBid + '<br/>');
            // alert('this.bidderListLastBidderName: ' + this.bidderListLastBidderName + '<br/>');
            // alert('this.bidderListCustomerId: ' + this.bidderListCustomerId + '<br/>');
            alert( 'this.maxCustomerBid: ' + this.maxCustomerBid + '<br/>' + 'this.isInputValid: ' +
                this.isInputValid );

        },
    },
    computed: {
        bidderListLastBidPrice() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice
        },
        bidderListLastCustomerMaxBid() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].customerMaxBid
        },
        bidderListLastBidderName() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].bidderName
        },
        bidderListCustomerId() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].customerId
        },
        // isInputValid() {
        //     if ( this.maxCustomerBid < bidderListLastBidPrice + 1 ) {
        //         return true
        //     }
        //     else {
        //         return false
        //     }
        // }
    }
} );
