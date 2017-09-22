const ApiService          = require( "services/ApiService" );

Vue.component( "auction-show-bidderlist", {

    props: {
        "template": String,
        "auctionid": Number,
    },

    data() {
        return {
            bidderList: [],
            bidders: 0
        };
    },

    created() {
        this.$options.template = this.template;
    },
    ready() {
      this.getBidderList();
    },
    methods: {
        getBidderList () {
            // this.auction = JSON.parse( this.auction );

            ApiService.get( "/api/bidderlist/" + this.auction.id )
                .done( bidderlist => {

                    console.dir(bidderlist);
                    // const bidderData     = this.getBidderList();
                    // var differentBidders = [];
                    //
                    // this.bidderList = [];
                    //
                    // for (var i = bidderData.length; --i >= 0;) {
                    //     var bidView = {};
                    //
                    //     bidView.bidderName   = bidderData[i].bidderName;
                    //     bidView.bidPrice     = bidderData[i].bidPrice;
                    //     bidView.bidStatus     = bidderData[i].bidStatus;
                    //     bidView.bidTimeStamp = bidderData[i].bidTimeStamp * 1000;
                    //
                    //     this.bidderList.push( bidView );
                    //
                    //     const currentUserId = bidderData[i].customerId;
                    //
                    //     if ( differentBidders.indexOf( currentUserId ) < 0 ) {
                    //         differentBidders.push( currentUserId );
                    //     }
                    // }
                    // this.bidders = differentBidders.length - 1;
                } )
                .fail( () => {
                           alert( 'Upps - ein Fehler bei bidderlist ??!!' );
                       }
                )

        },
        // getBidderList () {
        //     // ApiService.get( "/api/bidderlist/" + this.auctionid, JSON.stringify( bidderList ),
        //     //                                                       { contentType: "application/json" }
        //     // )
        //     //     .then( response => {
        //     //                this.reload( 5 );
        //     //            },
        //     //            error => {
        //     //                alert( 'error3: ' + error.toString() );
        //     //            }
        //     //     );
        //     //
        // }
    }
} )
;
