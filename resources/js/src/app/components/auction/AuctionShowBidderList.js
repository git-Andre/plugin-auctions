const NotificationService  = require( "services/NotificationService" );
const ResourceService      = require( "services/ResourceService" );
const AuctionBidderService = require( "services/AuctionBidderService" );

Vue.component( "auction-show-bidderlist", {

    props: [
        "template",
        "auctionid",
        "differentBidders"
    ],

    data() {
        return {
            bidderList: [],
            expiryDate: 0,
            isAuctionPresent: false,
            bidders: 0
        };
    },

    created() {
        this.$options.template = this.template;

        AuctionBidderService.getBidderList( this.auctionid ).then(
            response => {

                const bidderData     = response;
                var differentBidders = [];

                this.bidderList      = [];
                for (var i = bidderData.length; --i >= 0;) {
                    var bidView = {};

                    bidView.bidderName   = bidderData[i].bidderName;
                    bidView.bidPrice     = bidderData[i].bidPrice;
                    bidView.bidTimeStamp = bidderData[i].bidTimeStamp * 1000;

                    // this.bidderList.push( bidView );
                    //
                    // const currentUserId = bidderData[i].customerId;
                    // for (var j = 0; j++ >= differentBidders.length;) {
                    //     if (differentBidders[j] == currentUserId ) {
                    //         break
                    //     }
                    //     differentBidders.push(currentUserId);
                    // }
                }
                this.bidders = differentBidders.length;
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
