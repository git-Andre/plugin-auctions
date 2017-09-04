const ApiService           = require( "services/ApiService" ); // /plugin-ceres/resources/js/src/app/services/ApiService.js
const NotificationService  = require( "services/NotificationService" );
const AuctionBidderService = require( "services/AuctionBidderService" );

Vue.component( "auction-bids", {
    props: [
        "template",
        "auctionid",
        "userdata",
        "minBid"
    ],
    data: function data() {
        return {
            isInputValid: false,
            maxCustomerBid: null,
        }
    },
    created() {
        this.$options.template = this.template;
        this.userdata          = JSON.parse( this.userdata );
        this.auctionid         = parseInt( this.auctionid );
    },
    ready() {
        this.initMinBidPrice();
    },
    methods: {
        addBid() {
            var bidderListLastEntry = {};
            AuctionBidderService.getBidderListLastEntry( this.auctionid )
                .resolve(
                    response => {
                        bidderListLastEntry = response;
                        alert( 'response33: ' + response );
                    },
                    error => {
                        alert( 'error: ' + error );
                    }
                );

            alert( 'addBid: ' + bidderListLastEntry.bidPrice );
            // this.getBidderListLastEntry.then(
            //     response => {
            //         bidderListLastEntry.bidPrice = response;
            //     },
            //     error => {
            //     }
            // );
            var currentBid = {
                'bidPrice': 1,
                'customerMaxBid': 2,
                'bidderName': 'test***Kunde1',
                'customerId': 3
            };

            if ( this.maxCustomerBid > bidderListLastEntry.customerMaxBid ) {

                currentBid.bidPrice       = bidderListLastEntry.customerMaxBid + 1;
                currentBid.customerMaxBid = this.maxCustomerBid;
                currentBid.bidderName     = this.userdata.firstName;
                currentBid.customerId     = this.userdata.id;

                // alert( 'Glückwunsch - Sie sind der Höchstbietende...' );
                // this.updateAuction();
                NotificationService.success( "Glückwunsch - Sie sind der Höchstbietende..." )
                    .closeAfter( 3000 );
            }
            else {
                currentBid.bidPrice       = this.maxCustomerBid;
                currentBid.customerMaxBid = bidderListLastEntry.bidPrice;
                currentBid.bidderName     = bidderListLastEntry.bidderName;
                currentBid.customerId     = bidderListLastEntry.customerId;

                // alert( 'Es gibt leider schon ein höheres Gebot...' );
                // this.updateAuction( this.auctionid );

                NotificationService.success( "Es gibt leider schon ein höheres Gebot..." )
                    .closeAfter( 3000 );

            }

            // alert( 'this.userdata): ' + this.userdata.id + '\n' + '' );
        },
        initMinBidPrice() {
            ApiService.get( "/api/auction/" + this.auctionid, {}, { supressNotifications: true } )
                .done( auction => {
                    this.minBid = parseFloat( auction.bidderList[auction.bidderList.length - 1].bidPrice ) + 1;
                } )
                .fail( () => {
                    alert( 'Schade - ein Fehler beim abholen' );
                } );
        },
        updateAuction() {
            ApiService.put( "/api/bidderlist/" + this.auctionid, currentBid,
                                                                 { supressNotifications: false }
            )
                .done( function (auction) {
                    alert( "super!!!! abgespeichert" );
                } )
                .fail( function (auction) {
                    NotificationService.error( 'Schade - ein Fehler beim abspeichern' ).closeAfter( 3000 );
                    alert( 'Schade - ein Fehler beim abspeichern' );
                } );
        },
        // getBidderListLastEntry() {
        //     var lastBid = {};
        //
        //     ApiService.get( "/api/auction/" + this.auctionid, {}, { supressNotifications: true } )
        //         .then( function () {
        //             lastBid = auction.bidderList[auction.bidderList.length - 1];
        //         } );
        //     return lastBid;
        // },
        getBidderListLastEntry() {
            return AuctionBidderService.getBidderListLastEntry;
        },
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
