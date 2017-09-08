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
        this.auctionid         = parseInt( this.auctionid );
        this.initAuctionParams();
        this.versand = {};
    },
    ready() {
        this.userdata = JSON.parse( this.userdata );
    },
    methods: {
        addBid() {

            var currentBid          = {
                'bidPrice': 1,
                'customerMaxBid': 2.1,
                'bidderName': "versand***Kunde1",
                'customerId': 3
            };
            const newCustomerMaxBid = this.toFloatTwoDecimal( this.maxCustomerBid );
            const pos = this.userdata.email.indexOf("@");
            const newBidderName     = this.userdata.email.substring( 0, 2 ) + " *** " + this.userdata.email.substring(pos-2, pos);
            // const newBidderName     = this.userdata.firstName ? this.userdata.firstName + "... ***": "*** ... ***";
            const newUserId         = parseInt( this.userdata.id );
            const lastEntry         = true;

            AuctionBidderService.getBidderList( this.auctionid, lastEntry ).then(
                response => {

                    const bidderListLastEntry = response;

                    var lastBidPrice = this.toFloatTwoDecimal( bidderListLastEntry.bidPrice );
                    if ( lastBidPrice < 1.1 ) {
                        lastBidPrice = this.toFloatTwoDecimal( this.minBid - 1 );
                    }
                    const lastCustomerMaxBid = this.toFloatTwoDecimal( bidderListLastEntry.customerMaxBid );
                    const lastUserId         = parseInt( bidderListLastEntry.customerId );

                    if ( lastUserId == newUserId ) {

                        currentBid.bidPrice       = lastBidPrice;
                        currentBid.customerMaxBid = newCustomerMaxBid;
                        currentBid.bidderName     = newBidderName;
                        currentBid.customerId     = newUserId;

                        // ToDo: Abfrage: eigenes Maximal-Gebot wirklich ändern?
                        alert( 'Sie haben Ihr eigenes Maximal-Gebot verändert!' );
                        // NotificationService.success(Translations.Template.itemWishListAdded)
                    }
                    else {
                        if ( newCustomerMaxBid > lastCustomerMaxBid ) {

                            currentBid.bidPrice       = lastCustomerMaxBid + 1;
                            currentBid.customerMaxBid = newCustomerMaxBid;
                            currentBid.bidderName     = newBidderName;
                            currentBid.customerId     = newUserId;

                            alert( 'Glückwunsch - Sie sind der Höchstbietende...' );
                        }
                        else {
                            currentBid.bidPrice       = lastBidPrice + 1;
                            currentBid.customerMaxBid = lastCustomerMaxBid;
                            currentBid.bidderName     = bidderListLastEntry.bidderName;
                            currentBid.customerId     = lastUserId;

                            alert( 'Es gibt leider schon ein höheres Gebot...' );
                        }
                    }
                    this.versand = currentBid;
                    this.updateAuction();
                    this.versand = {};
                    location.reload();
                },
                error => {
                    alert( 'error2: ' + error.toString() );
                }
            );

        },
        updateAuction() {
            ApiService.put( "/api/bidderlist/" + this.auctionid, JSON.stringify( this.versand ),
                                                                 { contentType: "application/json" }
            )
                .then( response => {
                           // alert( response );
                       },
                       error => {
                           alert( 'error3: ' + error.toString() );
                       }
                );
        },
        initAuctionParams() {
            ApiService.get( "/api/auction/" + this.auctionid, {}, {} )
                .done( auction => {
                    this.minBid =
                        this.toFloatTwoDecimal( ( auction.bidderList[auction.bidderList.length - 1].bidPrice ) + 1 );
                    if ( this.minBid < 1.1 ) {
                        this.minBid = this.toFloatTwoDecimal( auction.currentPrice + 1 );
                    }
                } )
                .fail( () => {
                    alert( 'Upps - ein Fehler beim abholen ??!!' );
                } );
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
