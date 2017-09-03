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
                this.isInputValid = true;
            }
            else {
                this.isInputValid = false;
            }
        },
        addBid() {
            var newBidPrice = this.minBid;

            if (newBidPrice > this.bidderListLastCustomerMaxBid) {
                this.currentBidderList.bidPrice = newBidPrice;
                this.currentBidderList.customerMaxBid = this.maxCustomerBid;
                this.currentBidderList.bidderName = this.userdata.firstName;
                this.currentBidderList.customerId = this.userdata.id;
            }
            else {
                this.currentBidderList.bidPrice = newBidPrice;
                this.currentBidderList.customerMaxBid = this.bidderListLastCustomerMaxBid;
                this.currentBidderList.bidderName = this.bidderListLastBidderName;
                this.currentBidderList.customerId = this.bidderListLastCustomerId;

                alert('Es gibt leider schon ein höheres Gebot...');
            }

            // alert( 'this.userdata): ' + this.userdata.id + '\n' + '' );
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
        bidderListLastCustomerId() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].customerId
        }
    }
} );
