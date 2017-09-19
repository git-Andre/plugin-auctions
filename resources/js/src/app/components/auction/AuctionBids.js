const ApiService          = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );

// const AuctionBidderService = require( "services/AuctionBidderService" );

Vue.component( "auction-bids", {
    props: [
        "template",
        "userdata",
        "auction",
        "minBid",
        "auctionEnd"
    ],
    // props: {
    //     template: String,
    //     userdata: {},
    //     auction: {},
    //     minBid: Number,
    //     auctionEnd: { type: Boolean, default: false }
    // },
    data() {
        return {
            isInputValid: false,
            maxCustomerBid: null,
        }
    },
    created() {
        this.$options.template = this.template;
    },
    compiled() {
        this.userdata = JSON.parse( this.userdata );
        // this.initAuctionParams();
        this.auction  = JSON.parse( this.auction );

        if ( this.auction.bidderList.length > 1 ) {
            this.minBid =
                this.toFloatTwoDecimal( ( ( this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice ) ) +
                    1 );
        }
        else {
            this.minBid = this.toFloatTwoDecimal( this.auction.startPrice );
        }
    },
    ready() {
    },
    methods: {
        addBid() {
            if ( this.isInputValid ) {

                const pos           = this.userdata.email.indexOf( "@" );
                const newBidderName = this.userdata.email.slice( 0, 2 ) + " *** " +
                    this.userdata.email.slice( pos - 2, pos );

                var currentBid = {
                    'customerMaxBid': this.toFloatTwoDecimal( this.maxCustomerBid ),
                    'bidderName': newBidderName,
                    'customerId': parseInt( this.userdata.id ),
                };
                ApiService.put( "/api/bidderlist/" + this.auction.id, JSON.stringify( currentBid ),
                                                                     { contentType: "application/json" }
                )
                    .then( response => {
                               // this.reload( 500 );
                           },
                           error => {
                               alert( 'error3: ' + error.toString() );
                           }
                    );
            }
        },
        // addBidOld() {
        //     if ( this.isInputValid ) {
        //         var currentBid          = {
        //             'bidPrice': 1,
        //             'customerMaxBid': 2.1,
        //             'bidderName': "newBid***Kunde1",
        //             'customerId': 3
        //         };
        //         const newCustomerMaxBid = this.toFloatTwoDecimal( this.maxCustomerBid );
        //         const pos               = this.userdata.email.indexOf( "@" );
        //         const newBidderName     = this.userdata.email.slice( 0, 2 ) + " *** " + this.userdata.email.slice( pos - 2, pos );
        //
        //         const newUserId = parseInt( this.userdata.id );
        //
        //         const lastEntry = true;
        //
        //         AuctionBidderService.getBidderList( this.auctionid, lastEntry ).then(
        //             response => {
        //
        //                 const bidderListLastEntry = response;
        //
        //                 var lastBidPrice = this.toFloatTwoDecimal( bidderListLastEntry.bidPrice );
        //                 if ( lastBidPrice < 1.1 ) {
        //                     lastBidPrice = this.toFloatTwoDecimal( this.minBid - 1 );
        //                 }
        //                 const lastCustomerMaxBid = this.toFloatTwoDecimal( bidderListLastEntry.customerMaxBid );
        //                 const lastUserId         = parseInt( bidderListLastEntry.customerId );
        //
        //                 if ( lastUserId == newUserId ) {
        //
        //                     currentBid.bidPrice       = lastBidPrice;
        //                     currentBid.customerMaxBid = newCustomerMaxBid;
        //                     currentBid.bidderName     = newBidderName;
        //                     currentBid.customerId     = newUserId;
        //
        //                     this.newBid = currentBid;
        //                     this.updateAuctionWithNewBid();
        //                     // ToDo: Abfrage: eigenes Maximal-Gebot wirklich ändern?
        //                     NotificationService.info(
        //                         "Sie haben Ihr eigenes Maximal-Gebot verändert!<br>(auf: " + currentBid.customerMaxBid +
        //                         ")" )
        //                         .closeAfter( 3500 );
        //                 }
        //                 else {
        //                     if ( newCustomerMaxBid > lastCustomerMaxBid ) {
        //                         if ( newCustomerMaxBid < lastCustomerMaxBid + 1 ) {
        //                             currentBid.bidPrice = newCustomerMaxBid;
        //                         }
        //                         else {
        //                             currentBid.bidPrice = lastCustomerMaxBid + 1;
        //                         }
        //                         currentBid.customerMaxBid = newCustomerMaxBid;
        //                         currentBid.bidderName     = newBidderName;
        //                         currentBid.customerId     = newUserId;
        //
        //                         this.newBid = currentBid;
        //                         this.updateAuctionWithNewBid();
        //                         this.reload(3000);
        //                         NotificationService.success(
        //                             " GLÜCKWUNSCH<br>Sie sind jetzt der Höchstbietende..." )
        //                             .closeAfter( 3000 );
        //                     }
        //                     else {
        //                         currentBid.bidPrice       = newCustomerMaxBid;
        //                         currentBid.customerMaxBid = lastCustomerMaxBid;
        //                         currentBid.bidderName     = bidderListLastEntry.bidderName;
        //                         currentBid.customerId     = lastUserId;
        //
        //                         this.newBid = currentBid;
        //                         this.updateAuctionWithNewBid();
        //                         this.reload(3000);
        //
        //                         NotificationService.warn(
        //                             "Es gibt leider schon ein höheres Gebot..." )
        //                             .closeAfter( 3000 );
        //                     }
        //                 }
        //
        //                 // this.initAuctionParams();
        //             },
        //             error => {
        //                 alert( 'error2: ' + error.toString() );
        //             }
        //         );
        //     }
        // },
        // updateAuctionWithNewBid() {
        //     ApiService.put( "/api/bidderlist/" + this.auctionid, JSON.stringify( this.newBid ),
        //                                                          { contentType: "application/json" }
        //     )
        //         .then( response => {
        //                },
        //                error => {
        //                    alert( 'error3: ' + error.toString() );
        //                }
        //         );
        // },
        // initAuctionParams() {
        //     ApiService.get( "/api/auction/" + this.auctionid, {}, {} )
        //         .done( auction => {
        //             // Gibt es Gebote?
        //             if ( auction.bidderList.length > 1 ) {
        //                 this.minBid =
        //                     this.toFloatTwoDecimal( ( ( auction.bidderList[auction.bidderList.length - 1].bidPrice ) ) +
        //                         1 );
        //             }
        //             else {
        //                 this.minBid = this.toFloatTwoDecimal( auction.startPrice );
        //             }
        //         } )
        //         .fail( () => {
        //             alert( 'Upps - ein Fehler beim abholen ??!!' );
        //         } );
        // },

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
                "startPrice": this.minBid - 2
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
        // afterAuction() {
        //     // um Probleme mit letzten Geboten bei geringen Zeitunterschieden zu umgehen
        //     setTimeout( () => {
        //         if ( this.userdata ) {
        //             const currentUserId = this.userdata.id;
        //             const lastEntry     = false;
        //
        //             AuctionBidderService.getBidderList( this.auctionid, lastEntry ).then(
        //                 response => {
        //
        //                     const bidderList          = response;
        //                     const bidderListLastEntry = bidderList[bidderList.length - 1];
        //
        //                     const lastUserId = bidderListLastEntry.customerId;
        //
        //                     // Gewinner eingeloggt ??
        //                     if ( currentUserId == lastUserId ) {
        //                         NotificationService.success(
        //                             "Herzlichen Glückwunsch!<br>Sie haben diese Auktion gewonnen!<br>Sie können jetzt zur Kasse gehen." )
        //                             .close;
        //                         alert( "  // item -> Basket\n" + "// Url -> Checkout" )
        //                         // item -> Basket
        //                         // Url -> Checkout
        //                     }
        //                     // Gewinner nicht eingeloggt !!
        //                     else {
        //                         var isUserInBidderList = false;
        //
        //                         for (var i = bidderList.length; --i > 0;) {
        //                             const userId = bidderList[i].customerId;
        //
        //                             if ( currentUserId == userId ) {
        //                                 isUserInBidderList = true;
        //                                 break
        //                             }
        //                         }
        //                         // ist der eingeloggte User in BidderList
        //                         if ( isUserInBidderList ) {
        //                             NotificationService.error(
        //                                 "Leider wurden Sie überboten...<br>Wir wünschen mehr Glück bei einer nächsten Auktion." ).close;
        //                             this.reload( 3000 );
        //                         }
        //                         // nein
        //                         else {
        //                             NotificationService.info( "Bei dieser Auktion haben Sie nicht mitgeboten." ).close;
        //                             this.reload( 3000 );
        //                         }
        //                     }
        //                 },
        //                 error => {
        //                     alert( 'error5: ' + error.toString() );
        //                 }
        //             );
        //         }
        //         else {
        //             NotificationService.warn( "Nicht angemeldet... -> reload" ).close;
        //             this.reload( 3000 );
        //         }
        //     }, 1500 );
        // },
        reload(timeout) {
            setTimeout( () => {
                location.reload();
            }, timeout );
        },
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
        },
        auctionEnd: function () {
            if ( this.auctionEnd ) {
                this.afterAuction();
            }
        }
    }
    ,
} )
;
