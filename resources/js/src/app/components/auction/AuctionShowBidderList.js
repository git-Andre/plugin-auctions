const NotificationService  = require( "services/NotificationService" );
const ResourceService      = require( "services/ResourceService" );
const AuctionBidderService = require( "services/AuctionBidderService" );

Vue.component( "auction-show-bidderlist", {

    props: [
        "template",
        "auctionid"
    ],

    data() {
        return {
            bidderList: [],
            expiryDate: 0,
            isAuctionPresent
        };
    },

    created() {
        this.$options.template = this.template;

        AuctionBidderService.getBidderList( this.auctionid ).then(
            response => {

                const bidderData = response;

                // this.bidderdata = JSON.parse( this.bidderData );
                this.bidderList = [];
                for (var i = bidderData.length; --i >= 0;) {
                    var bidView = {};
                    // var bidView = { "bidderName": "Name", "bidPrice": 1.1, "bidTimeStamp": 152 };

                    bidView.bidderName = bidderData[i].bidderName;
                    bidView.bidPrice   = bidderData[i].bidPrice;

                    // var date = new Date (bidderData[i].bidTimeStamp * 1000);

                    bidView.bidTimeStamp = bidderData[i].bidTimeStamp * 1000;

                    this.bidderList.push( bidView );
                }
            },
            error => {
                alert( 'error4: ' + error.toString() );
            }
        );
        AuctionBidderService.getExpiryDate( this.auctionid ).then(
            response => {
                this.expiryDate = response;
            },
            error => {
                alert( 'error5: ' + error.toString() );
            }
        );

        this.isAuctionPresent = Math.trunc( (new Date()).getTime() / 1000 ) < this.expiryDate;
    },

    ready() {

    },

    methods:
        {}
} );
