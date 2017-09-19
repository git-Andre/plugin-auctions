// const NotificationService  = require( "services/NotificationService" );
// const ResourceService      = require( "services/ResourceService" );
// const AuctionBidderService = require( "services/AuctionBidderService" );

Vue.component( "auction-show-bidderlist", {

    props: {
        "template": String,
        "bidderlist": {},
    },

    data() {
        return {
            bidderList: [],
            bidders: 0
        };
    },

    created() {
        this.$options.template = this.template;

        this.auction = JSON.parse( this.auction );

        const bidderData     = this.auction.bidderList;
        var differentBidders = [0];

        this.bidderList = [];
        for (var i = bidderData.length; --i >= 0;) {
            var bidView = {};

            bidView.bidderName   = bidderData[i].bidderName;
            bidView.bidPrice     = bidderData[i].bidPrice;
            bidView.bidTimeStamp = bidderData[i].bidTimeStamp * 1000;

            this.bidderList.push( bidView );

            const currentUserId = bidderData[i].customerId;

            if ( differentBidders.indexOf( currentUserId ) < 0 ) {
                differentBidders.push( currentUserId );
            }
        }
        this.bidders = differentBidders.length - 1;

        // AuctionBidderService.getBidderList( this.auctionid )
        //     .then(
        //         response => {
        //             const bidderData     = response;
        //             var differentBidders = [0];
        //
        //             this.bidderList = [];
        //             for (var i = bidderData.length; --i >= 0;) {
        //                 var bidView = {};
        //
        //                 bidView.bidderName   = bidderData[i].bidderName;
        //                 bidView.bidPrice     = bidderData[i].bidPrice;
        //                 bidView.bidTimeStamp = bidderData[i].bidTimeStamp * 1000;
        //
        //                 this.bidderList.push( bidView );
        //
        //                 const currentUserId = bidderData[i].customerId;
        //
        //                 if ( differentBidders.indexOf( currentUserId ) < 0 ) {
        //                     differentBidders.push( currentUserId );
        //                 }
        //             }
        //             this.bidders = differentBidders.length - 1;
        //         },
        //         error => {
        //             alert( 'error4: ' + error.toString() );
        //         }
        //     );
        // AuctionBidderService.getExpiryDate( this.auctionid )
        //     .then(
        //         response => {
        //
        //             this.expiryDate = response;
        //
        //             // if ( Math.trunc( (new Date()).getTime() / 1000 ) < this.expiryDate ) {
        //             //     this.isAuctionPresent = true;
        //             // }
        //             // else {
        //             //     this.isAuctionPresent = false;
        //             // };
        //         },
        //         error => {
        //             alert( 'error5: ' + error.toString() );
        //         }
        //     );
    },

    ready() {

    },

    methods:
        {}
} )
;
