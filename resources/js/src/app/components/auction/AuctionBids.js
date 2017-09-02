// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    props: [
        "template",
        "auction",
        "auctionId",
        "userdata"
    ],
    data: function data() {
        return {
            currentBidderList: { 'bidPrice': 1, 'customerMaxBid': 2, 'bidderName': 'test***Kunde1', 'customerId': 3 },
            isInputValid: false,
            maxCustomerBid: null,
            minBid: 1.99,
        }
    },
    created() {
        this.$options.template = this.template;
        this.auction           = JSON.parse( this.auction );
        this.userdata          = JSON.parse( this.userdata );
        this.auctionId         = this.auction['id'];
        this.minBid            = this.bidderListLastBidPrice + 1;
    },
    methods: {
        isValid() {
            if ( this.maxCustomerBid >= this.minBid ) {
                this.isInputValid        = true;
            }
            else {
                this.isInputValid        = false;
            }
        },
        addBid() {

            alert( 'this.userdata): ' + this.userdata + '\n' + '' );
        }
        ,
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
        bidderListLastCustomerId() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].customerId
        }
    }
} );
