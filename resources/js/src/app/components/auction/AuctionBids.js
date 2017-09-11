const ApiService           = require( "services/ApiService" );
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
            const pos               = this.userdata.email.indexOf( "@" );
            const newBidderName     = this.userdata.email.slice( 0, 2 ) + " *** " +
                this.userdata.email.slice( pos - 2, pos );

            // const newBidderName     = this.userdata.firstName ? this.userdata.firstName + "... ***": "*** ... ***";
            const newUserId = parseInt( this.userdata.id );

            const lastEntry = true;

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
                        // alert( 'Sie haben Ihr eigenes Maximal-Gebot verändert!' );
                        NotificationService.info(
                            { "message": "Sie haben Ihr eigenes Maximal-Gebot verändert!", "code": 2 } )
                            .closeAfter( 5000 );
                    }
                    else {
                        if ( newCustomerMaxBid > lastCustomerMaxBid ) {
                            if ( newCustomerMaxBid < lastCustomerMaxBid + 1 ) {
                                currentBid.bidPrice = newCustomerMaxBid;
                            }
                            else {
                                currentBid.bidPrice = lastCustomerMaxBid + 1;
                            }
                            currentBid.customerMaxBid = newCustomerMaxBid;
                            currentBid.bidderName     = newBidderName;
                            currentBid.customerId     = newUserId;

                            NotificationService.success(
                                { "message": " GLÜCKWUNSCH<br>Sie sind jetzt der Höchstbietende...", "code": 1 } )
                                .closeAfter( 5000 );

                            // alert( 'Glückwunsch - Sie sind der Höchstbietende...' );
                        }
                        else {
                            currentBid.bidPrice       = lastBidPrice + 1;
                            currentBid.customerMaxBid = lastCustomerMaxBid;
                            currentBid.bidderName     = bidderListLastEntry.bidderName;
                            currentBid.customerId     = lastUserId;

                            NotificationService.warn(
                                { "message": "Es gibt leider schon ein höheres Gebot...", "code": 2 } )
                                .closeAfter( 5000 );

                            // alert( 'Es gibt leider schon ein höheres Gebot...' );
                        }
                    }

                    // NotificationService.error( {"message1": "<h4>Titel</h4> und jetzt die Nachricht", "code": 2} );
                    // NotificationService.info({"message":"message 4", "code": null});

                    this.versand = currentBid;
                    this.updateAuction();
                    this.versand = {};
                    // location.reload();
                    this.initAuctionParams();
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
        },
    },
    computed: {},
    watch: {
        maxCustomerBid: function () {

            if ( this.maxCustomerBid >= this.minBid ) {
                if ( this.userdata != null ) {
                    this.isInputValid = true
                }
                else {
                    NotificationService.error(
                        { "message": "Bitte loggen Sie sich ein<br>bzw. registrieren Sie sich!", "code": 0 } )
                        .closeAfter( 5000 );
                    this.isInputValid = false;
                }
            }
            else {
                this.isInputValid = false;
            }
            console.log( 'this.isInputValid: ' + this.isInputValid );
        }
    },
} );
