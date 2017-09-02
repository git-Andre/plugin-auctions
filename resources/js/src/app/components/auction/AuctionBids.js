// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    // name: "auctionbids",
    props: [
        "template",
        "biddata",
        "auction",
        "auctionId",
        "maxCustomerBid"
    ],
    data: function data() {
        return {
            currentBidderList: [],
            isInputValid: false,
        }
            ;
    },
    created() {
        this.$options.template = this.template;
        this.auction           = JSON.parse( this.biddata );
        this.biddata           = this.auction;
        /* all dataInput-handling is stupid, but I'm a js-amateur..*/
        this.auctionId = this.auction['id'];
    },
    methods: {

        isValid() {
           if (this.maxCustomerBid < this.bidderListLastBidPrice + 1) {
               return false;
           } else {
               return true;
           }
        },
        addBid() {
            // var test=  this.auction['id']
            // var test =  this.auction.bidderList[1].bidderName;
            // var test = this.bidderListLastPrice

            // alert('this.bidderListLastBidPrice: ' + this.bidderListLastBidPrice + '<br/>');
            // alert('this.bidderListLastCustomerMaxBid: ' + this.bidderListLastCustomerMaxBid + '<br/>');
            // alert('this.bidderListLastBidderName: ' + this.bidderListLastBidderName + '<br/>');
            // alert('this.bidderListCustomerId: ' + this.bidderListCustomerId + '<br/>');
            alert( 'this.maxCustomerBid: ' + this.maxCustomerBid + '\n' + 'this.isInputValid: ' +
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
        }
    }
} );
