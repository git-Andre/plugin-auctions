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
            bidderList: []
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
                    // var bidView = {};
                    var bidView = { "bidderName": "Name", "bidPrice": 1.1, "bidTimeStamp": 152 };

                    bidView.bidderName   = bidderData[i].bidderName;
                    bidView.bidPrice     = bidderData[i].bidPrice;
                    bidView.bidTimeStamp = bidderData[i].bidTimeStamp;

                    this.bidderList.push( bidView );
                }
                console.dir( this.bidderList );

            },
            error => {
                alert( 'error4: ' + error.toString() );
            }
        );
    },

    ready() {

    },

    methods:
        {}
} );
