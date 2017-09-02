// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    props: [
        "template",
        "biddata",
        "auctionId",
        "maxCustomerBid"
    ],
    data: function data() {
        return {
            currentBidderList: [],
            isInputValid: false
        }
    },
    created() {
        this.$options.template = this.template;
        this.biddata           = JSON.parse( this.biddata );
        this.auctionId = this.biddata['id'];
    },
    methods: {

        isValid() {

           if (this.maxCustomerBid < (this.bidderListLastBidPrice + 1)) {
               this.isInputValid = false;
           } else {
               this.isInputValid = true;
           }
            alert( 'this.maxCustomerBid: ' + this.maxCustomerBid + '\n' + 'this.isInputValid: ' + this.isInputValid );

        },
        addBid() {
            // var test=  this.biddata['id']
            // var test =  this.biddata.bidderList[1].bidderName;
            // var test = this.bidderListLastPrice

            // alert('this.bidderListCustomerId: ' + this.bidderListCustomerId + '<br/>');
            alert( 'this.maxCustomerBid: ' + this.maxCustomerBid + '\n' + 'this.isInputValid: ' + this.isInputValid );
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
        bidderListCustomerId() {
            return this.biddata.bidderList[this.biddata.bidderList.length - 1].customerId
        }
    }
} );
