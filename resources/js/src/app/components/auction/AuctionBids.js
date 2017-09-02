// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    props: [
        "template",
        "biddata",
        "auctionId",
    ],
    data: function data() {
        return {
            currentBidderList: { 'bidPrice': 1, 'customerMaxBid': 2, 'bidderName': 'test***Kunde1', 'customerId': 3 },
            isInputValid: false,
            isUserLoggedIn: false,
            maxCustomerBid: 0,
            minBid: 1.99
        }
    },
    created() {
        this.$options.template = this.template;
        this.biddata           = JSON.parse( this.biddata );
        this.auctionId         = this.biddata['id'];
        this.minBid = this.bidderListLastBidPrice + 1;
    },
    methods: {

        isValid() {
            if ( this.maxCustomerBid < (this.bidderListLastBidPrice + 1) ) {
                this.isInputValid = false;
            }
            else {
                this.isInputValid = true;
            }
        },
        addBid() {

            alert( 'currentBidderList): ' + this.currentBidderList + '\n' + '' );
        },
    },
    computed: {
        bidderListLastBidPrice() {
            return this.biddata.bidderList[this.biddata.bidderList.length - 1].bidPrice
        },
        bidderListLastCustomerMaxBid() {
            return this.biddata.bidderList[this.biddata.bidderList.length - 1].customerMaxBid
        },
        bidderListLastBidderName() {
            return this.biddata.bidderList[this.biddata.bidderList.length - 1].bidderName
        },
        bidderListLastCustomerId() {
            return this.biddata.bidderList[this.biddata.bidderList.length - 1].customerId
        }
    }
} );
