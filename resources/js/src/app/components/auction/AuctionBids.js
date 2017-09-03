const ApiService          = require( "services/ApiService" );
// /plugin-ceres/resources/js/src/app/services/ApiService.js
const NotificationService = require( "services/NotificationService" );
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    props: [
        "template",
        "auction",
        "auctionId",
        "userdata"
    ],
    data: function data() {
        return {
            isInputValid: false,
            maxCustomerBid: null,
            minBid: 1.99,
        }
    },
    created() {
        this.$options.template = this.template;
        this.auction           = JSON.parse( this.auction );
        this.userdata          = JSON.parse( this.userdata );
        this.auctionId         = this.auction['id'];
        this.minBid            = this.bidderListLastBidPrice + 1;
    },
    methods: {
        addBid() {
            var currentBidderList   = {
                'bidPrice': 1,
                'customerMaxBid': 2,
                'bidderName': 'test***Kunde1',
                'customerId': 3
            };
            var bidderListLastEntry = this.getBidderListLastEntry();
            if ( this.maxCustomerBid > bidderListLastEntry ) {

                currentBidderList.bidPrice       = bidderListLastEntry.customerMaxBid + 1;
                currentBidderList.customerMaxBid = this.maxCustomerBid;
                currentBidderList.bidderName     = this.userdata.firstName;
                currentBidderList.customerId     = this.userdata.id;

                // alert( 'Glückwunsch - Sie sind der Höchstbietende...' );
                this.updateAuction();
                NotificationService.success( "Glückwunsch - Sie sind der Höchstbietende..." )
                    .closeAfter( 3000 );
            }
            else {
                currentBidderList.bidPrice       = this.maxCustomerBid;
                currentBidderList.customerMaxBid = bidderListLastEntry.bidPrice;
                currentBidderList.bidderName     = this.bidderListLastBidderName;
                currentBidderList.customerId     = this.bidderListLastCustomerId;

                // alert( 'Es gibt leider schon ein höheres Gebot...' );
                this.updateAuction(this.auctionId);
                NotificationService.success( "Es gibt leider schon ein höheres Gebot..." )
                    .closeAfter( 3000 );

            }

            // alert( 'this.userdata): ' + this.userdata.id + '\n' + '' );
        },
        getBidderListLastEntry() {

            ApiService.get( "/api/auction/" + this.auctionId, {}, { supressNotifications: true } )
                .done( function (auction) {

                    alert( auction.bidderList[auction.bidderList.length - 1].customerMaxBid );
                    return auction.bidderList[auction.bidderList.length - 1];
                } )
                .fail( function (auction) {
                    alert( 'Schade - ein Fehler beim abholen' );
                } );
        },
        updateAuction() {
            ApiService.put( "/api/bidderlist/" + this.auctionId, currentBidderList,
                                                                 { supressNotifications: false }
            )
                .done( function (auction) {
                    // alert ("super!!!! abgespeichert");
                } )
                .fail( function (auction) {
                    NotificationService.error( 'Schade - ein Fehler beim abspeichern' ).closeAfter( 3000 );
                    alert( 'Schade - ein Fehler beim abspeichern' );
                } );
        }
    },
    computed: {
        bidderListLastBidPrice() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice
        },
        // bidderListLastCustomerMaxBid() {
        //     cache: false;
        //     return this.auction.bidderList[this.auction.bidderList.length - 1].customerMaxBid
        // },
        bidderListLastBidderName() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].bidderName
        },
        bidderListLastCustomerId() {
            return this.auction.bidderList[this.auction.bidderList.length - 1].customerId
        }
    },
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
