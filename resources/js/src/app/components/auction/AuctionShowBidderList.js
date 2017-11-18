const ApiService          = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );

Vue.component( "auction-show-bidderlist", {

    props: {
        template: String,
        auctionid: String
    },

    data() {
        return {
            bidderList: [],
            bidders: 0
        };
    },

    created() {
        this.$options.template = this.template;
        this.auctionid         = parseInt( this.auctionid );
    },
    ready() {
        this.getBidderList();
    },
    methods: {
        getBidderList() {
            ApiService.get( "/auctions/bidderlist/" + this.auctionid )
                .done( biddersFromServer => {

                    // const bidderData     = this.getBidderList();
                    var differentBidders = [];

                    this.bidderList = [];

                    for (var i = biddersFromServer.length; --i >= 0;) {
                        var bidView = {};

                        bidView.bidderName   = biddersFromServer[i].bidderName;
                        bidView.bidPrice     = biddersFromServer[i].bidPrice;
                        bidView.bidStatus    = biddersFromServer[i].bidStatus;
                        bidView.bidTimeStamp = biddersFromServer[i].bidTimeStamp * 1000;

                        this.bidderList.push( bidView );

                        const currentUserId = biddersFromServer[i].customerId;

                        if ( differentBidders.indexOf( currentUserId ) < 0 ) {
                            differentBidders.push( currentUserId );
                        }
                    }
                    this.bidders = differentBidders.length - 1;
                } )
                .fail( () => {
                           NotificationService.error( "Upps - ein Fehler bei biddersFromServer ??!!" ).close;
                       }
                );
        }
    }
} )
;
