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
        "auctionEnd"
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
        this.auctionEnd        = false;
        this.initAuctionParams();
        this.versand = {};
    },
    ready() {
        this.userdata = JSON.parse( this.userdata );
    },
    methods: {
        addBid() {
            if ( this.isInputValid ) {
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

                            this.versand = currentBid;
                            this.updateAuction();
                            // ToDo: Abfrage: eigenes Maximal-Gebot wirklich ändern?
                            NotificationService.info(
                                "Sie haben Ihr eigenes Maximal-Gebot verändert!<br>(auf: " + currentBid.customerMaxBid +
                                ")" )
                                .closeAfter( 3500 );
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

                                this.versand = currentBid;
                                this.updateAuction();
                                this.reload();
                                NotificationService.success(
                                    " GLÜCKWUNSCH<br>Sie sind jetzt der Höchstbietende..." )
                                    .closeAfter( 3000 );
                            }
                            else {
                                currentBid.bidPrice       = newCustomerMaxBid;
                                currentBid.customerMaxBid = lastCustomerMaxBid;
                                currentBid.bidderName     = bidderListLastEntry.bidderName;
                                currentBid.customerId     = lastUserId;

                                this.versand = currentBid;
                                this.updateAuction();
                                this.reload();

                                NotificationService.warn(
                                    "Es gibt leider schon ein höheres Gebot..." )
                                    .closeAfter( 3000 );
                            }
                        }

                        // this.initAuctionParams();
                    },
                    error => {
                        alert( 'error2: ' + error.toString() );
                    }
                );
            }
        },
        updateAuction() {
            ApiService.put( "/api/bidderlist/" + this.auctionid, JSON.stringify( this.versand ),
                                                                 { contentType: "application/json" }
            )
                .then( response => {
                       },
                       error => {
                           alert( 'error3: ' + error.toString() );
                       }
                );
        },
        initAuctionParams() {
            ApiService.get( "/api/auction/" + this.auctionid, {}, {} )
                .done( auction => {
                    const lastBid    = this.toFloatTwoDecimal(
                        ( auction.bidderList[auction.bidderList.length - 1].bidPrice ) );
                    const startPrice = this.toFloatTwoDecimal( auction.currentPrice );
                    // Gibt es Gebote?
                    if ( auction.bidderList.length > 1 ) {
                        this.minBid = lastBid + 1;
                    }
                    else {
                        this.minBid = startPrice;
                    }
                } )
                .fail( () => {
                    alert( 'Upps - ein Fehler beim abholen ??!!' );
                } );
        },
        toFloatTwoDecimal(value) {
            return Math.round( parseFloat( value ) * 100 ) / 100.0
        },
        auctionend() {
            var startD  = Math.trunc( (new Date()).getTime() / 1000 );
            startD      = startD - 24 * 60 * 60 + 7;
            var Bidtest = {
                "startDate": startD,
                "startHour": 16,
                "startMinute": 45,
                "auctionDuration": 1,
                "currentPrice": this.minBid - 2
            };

            ApiService.put( "/api/auction/34", JSON.stringify( Bidtest ), { contentType: "application/json" }
            )
                .done( auction => {
                    // alert( "ok" );
                } )
                .fail( () => {
                    alert( 'Upps - ein Fehler beim auctionend ??!!' );
                } );
        },
        // auctionstart() {
        //     var startD  = Math.trunc( (new Date()).getTime() / 1000 );
        //     startD      = startD - 24 * 60 * 60 + 7;
        //     var Bidtest = {
        //         "startDate": startD,
        //         "startHour": 16,
        //         "startMinute": 45,
        //         "auctionDuration": 1,
        //         "currentPrice": this.minBid - 2
        //     };
        //
        //     ApiService.put( "/api/auction/28", JSON.stringify( Bidtest ), { contentType: "application/json" }
        //     )
        //         .done( auction => {
        //             // alert( "ok" );
        //         } )
        //         .fail( () => {
        //             alert( 'Upps - ein Fehler beim auctionend ??!!' );
        //         } );
        // },
        afterAuction() {
            if ( this.userdata ) {
                const currentUserId = this.userdata.id;

                const lastEntry = false;

                AuctionBidderService.getBidderList( this.auctionid, lastEntry ).then(
                    response => {

                        const bidderList          = response;
                        const bidderListLastEntry = bidderList[bidderList.length - 1];

                        const lastUserId = bidderListLastEntry.customerId;
                        if ( currentUserId == lastUserId ) {
                            // alert( "Du hast gewonnen!" );
                            NotificationService.error( "Du hast gewonnen!" ).close;

                            // item -> Basket
                            // Url -> Checkout
                        }
                        else {
                            var isUserInBidderList = false;

                            for (var i = bidderList.length; --i > 0;) {
                                console.log( 'i inner: ' + i );
                                const userId = bidderList[i].customerId;

                                if ( currentUserId == userId ) {
                                    isUserInBidderList = true;
                                    break
                                }
                            }
                            console.log( 'i outer: ' + i );

                            if ( isUserInBidderList ) {
                                // alert("Leider überboten...")
                                NotificationService.error( "Leider überboten..." ).close;

                            } else {
                                NotificationService.info( "Nicht geboten -> reload" ).close;

                                // this.reload();
                            }
                        }
                    }
                    ,
                    error => {
                        alert( 'error5: ' + error.toString() );
                    }
                );
            }
            else {
                NotificationService.warn( "Nicht angemeldet... -> reload" ).close;
                // this.reload();
            }
        },
        reload() {
            setTimeout( () => {
                location.reload();
            }, 3000 );
        }
    },
    watch: {
        maxCustomerBid: function () {

            if ( this.maxCustomerBid >= this.minBid ) {
                if ( this.userdata != null ) {
                    this.isInputValid = true
                }
                else {
                    NotificationService.error(
                        { "message": "Bitte loggen Sie sich ein<br>bzw. registrieren Sie sich!" } )
                        .closeAfter( 4000 );
                    this.isInputValid = false;
                }
            }
            else {
                this.isInputValid = false;
            }
        }
        ,

        auctionEnd: function () {
            if ( this.auctionEnd ) {
                this.afterAuction();
            }

        }

    }
    ,
} )
;
