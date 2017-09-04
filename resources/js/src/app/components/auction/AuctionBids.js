const ApiService           = require( "services/ApiService" ); // /plugin-ceres/resources/js/src/app/services/ApiService.js
const NotificationService  = require( "services/NotificationService" );
const AuctionBidderService = require( "services/AuctionBidderService" );

Vue.component( "auction-bids", {
    props: [
        "template",
        "auctionid",
        "userdata",
        "minBid",
        "versand",
    ],
    data() {
        return {
            isInputValid: false,
            maxCustomerBid: null,
        }
    },
    created() {
        this.$options.template = this.template;
        this.minBid            = 0;
        this.initAuctionParams();
        this.userdata  = JSON.parse( this.userdata );
        this.auctionid = parseInt( this.auctionid );
    },
    ready() {
    },
    methods: {
        addBid() {

            var currentBid       = {
                'bidPrice': 1,
                'customerMaxBid': 2.1,
                'bidderName': "versand***Kunde1",
                'customerId': 3
            };
            const maxCustomerBid = this.toFloatTwoDecimal( this.maxCustomerBid );
            const bidderName     = this.userdata.firstName + "...";
            const userId         = parseInt( this.userdata.id );

            AuctionBidderService.getBidderListLastEntry( this.auctionid ).then(
                response => {

                    const bidderListLastEntry = response;

                    var lastBidPrice = this.toFloatTwoDecimal( bidderListLastEntry.bidPrice );
                    if ( lastBidPrice < 1.1 ) {
                        lastBidPrice = this.toFloatTwoDecimal( this.minBid - 1 );
                    }
                    const lastCustomerMaxBid = this.toFloatTwoDecimal( bidderListLastEntry.customerMaxBid );
                    const lastUserId         = parseInt( bidderListLastEntry.customerId );

                    if ( lastUserId == userId ) {
                        NotificationService.success( "Sie haben Ihr eigenes Gebot erhöht!" )
                            .closeAfter( 3000 );
                        alert( 'Sie haben Ihr eigenes Gebot erhöht!' );
                    }
                    if ( maxCustomerBid > lastCustomerMaxBid ) {

                        currentBid.bidPrice       = lastBidPrice + 1;
                        currentBid.customerMaxBid = maxCustomerBid;
                        currentBid.bidderName     = bidderName;
                        currentBid.customerId     = userId;
                        // alert( 'Glückwunsch - Sie sind der Höchstbietende...' );
                        NotificationService.success( "Glückwunsch - Sie sind der Höchstbietende..." );
                        // .closeAfter( 3000 );
                    }
                    else {
                        currentBid.bidPrice       = maxCustomerBid;
                        currentBid.customerMaxBid = lastCustomerMaxBid;
                        currentBid.bidderName     = bidderListLastEntry.bidderName;
                        currentBid.customerId     = lastUserId;

                        alert( 'Es gibt leider schon ein höheres Gebot...' );

                        NotificationService.success( "Es gibt leider schon ein höheres Gebot..." )
                            .closeAfter( 3000 );

                    }
                    this.versand = currentBid;
                    // this.updateAuction();
                    this.versand = {};
                },
                error => {
                    NotificationService.error( 'Schade - ein Fehler beim abspeichern' ).closeAfter( 3000 );
                    alert( 'error2: ' + error.toString() );
                }
            );

        },
        updateAuction() {
            ApiService.put( "/api/bidderlist/" + this.auctionid, JSON.stringify( this.versand ),
                                                                 { contentType: "application/json" }
            )
                .then( response => {
                           // alert( "super!!!! abgespeichert" );
                           NotificationService.success( "test" );
                           /*.closeAfter( 3000 );*/
                           location.reload();
                       },
                       error => {
                           NotificationService.error( 'Schade - ein Fehler beim abspeichern' ).closeAfter( 3000 );
                           alert( 'error2: ' + error.toString() );
                       }
                );
        },
        initAuctionParams() {
            ApiService.get( "/api/auction/" + this.auctionid, {}, { supressNotifications: false } )
                .done( auction => {
                    // NotificationService.error( 'Juchuuh' ).closeAfter( 3000 );

                    this.minBid =
                        this.toFloatTwoDecimal( ( auction.bidderList[auction.bidderList.length - 1].bidPrice ) + 1 );
                    if ( this.minBid < 1.1 ) {
                        this.minBid = this.toFloatTwoDecimal( auction.currentPrice + 1 );
                    }
                } )
                .fail( () => {
                    alert( 'Upps - ein Fehler beim abholen ??!!' );
                } );
            this.versand = {};
        },
        toFloatTwoDecimal(value) {
            return Math.round( parseFloat( value ) * 100 ) / 100.0
        }
    },
    computed: {},
    watch: {
        maxCustomerBid: function () {
            if ( this.maxCustomerBid >= this.minBid ) {
                this.isInputValid = true;
            }
            else {
                this.isInputValid = false;
            }
        }
    },
} );
