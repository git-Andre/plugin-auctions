const NotificationService = require( "services/NotificationService" );
const ResourceService     = require( "services/ResourceService" );
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
        AuctionBidderService.getBidderList( this.auctionid ).then(
            response => {

                const bidderList = response;


            },
            error => {
                alert( 'error4: ' + error.toString() );
            }
        );




        this.$options.template = this.template;


        this.bidderdata = JSON.parse( this.bidderdata );
        this.bidderList = [];

        for (var i = this.bidderdata.length; --i >= 0;) {
            var bidView     = { };

            bidView.bidderName = this.bidderdata[i].bidderName;
            bidView.bidPrice = this.bidderdata[i].bidPrice;
            bidView.bidTimeStamp = this.bidderdata[i].bidTimeStamp;

            this.bidderList.push( bidView );
        }
        this.bidderdata = [];
    },

    ready() {

    },

    methods:
        {
        }
} );
