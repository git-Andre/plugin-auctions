// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    props: [
        "template",
        "auction",
        "auctionId",
    ],
    data: function data() {
        return {
            currentBidderList: { 'bidPrice': 1, 'customerMaxBid': 2, 'bidderName': 'test***Kunde1', 'customerId': 3 },
            isInputValid: false,
            isUserLoggedIn: false,
            maxCustomerBid: null,
            minBid: 1.99,
            isUserLoggedInAlert: false
        }
    },
    created() {
        this.$options.template = this.template;
        this.auction           = JSON.parse( this.auction );
        this.auctionId         = this.auction['id'];
        this.minBid            = this.bidderListLastBidPrice + 1;
    },
    methods: {
        isValid() {
            if ( this.maxCustomerBid > this.minBid ) {

                if (!this.isUserLoggedIn ) {
                    this.isInputValid = false;
                    this.isUserLoggedInAlert = true;
                }
                else {
                    this.isUserLoggedInAlert = false;
                    this.isInputValid = true;
                }
            }
            else {
                    this.isUserLoggedInAlert = false;
                    this.isInputValid = false;
            }
        },
        addBid() {

            alert( 'currentBidderList): ' + JSON.parse(this.currentBidderList) + '\n' + '' );
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
