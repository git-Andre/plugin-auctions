const ApiService          = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );
const AuctionConstants    = require( "constants/AuctionConstants" );
// const AuctionBidderService = require( "services/AuctionBidderService" );

// (mini encrypt() ToDo: richtig verschlüsseln - evtl. auch die MaxBids für späteren Gebrauch (KundenKonto) s. server- php
const MINI_CRYPT  = 46987;
const NOTIFY_TIME = 10000;

Vue.component( "auction-bids", {
    props: [
        "template",
        "userdata",
        "auction",
        "minBid",
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
    },
    compiled() {
        this.userdata   = JSON.parse( this.userdata );
        this.currentBid = {};
        this.auction    = JSON.parse( this.auction );
        this.minBid     = this.toFloatTwoDecimal( ( ( this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice ) ) + 1 );
    },
    ready() {

        // tense "present" und Customer loggedIn ??
        if ( (this.auction.tense == AuctionConstants.PRESENT || this.auction.tense == AuctionConstants.PAST) &&
            this.userdata != null ) {
            // Auswertung für Bieter in Bidderlist bzw. auch für den gerade in Session gespeicherten User... ???!!
            if ( this.hasLoggedInUserBiddenYet() || sessionStorage.getItem("currentBidder") == this.userdata.id + MINI_CRYPT ) {
                this.evaluateAndNotify();
            }
        }
    },
    methods: {
        addBid() {
            ApiService.get( "/api/auctionbidprice/" + this.auction.id )
                .done( lastBidPrice => {
                    // ist es ein gültiges Gebot (höher als letztes Gebot) ?
                    if ( this.maxCustomerBid > this.toFloatTwoDecimal( lastBidPrice ) ) {

                        const pos           = this.userdata.email.indexOf( "@" );
                        const newBidderName = this.userdata.email.slice( 0, 2 ) + " *** " +
                            this.userdata.email.slice( pos - 2, pos );

                        var currentBid = {
                            'customerMaxBid': this.toFloatTwoDecimal( this.maxCustomerBid ),
                            'bidderName': newBidderName,
                            'customerId': parseInt( this.userdata.id ),
                        };

                        // super Time Tunnel
                        sessionStorage.setItem( "currentBidder", this.userdata.id + MINI_CRYPT );

                        ApiService.put( "/api/bidderlist/" + this.auction.id, JSON.stringify( currentBid ),
                                                                              { contentType: "application/json" }
                        )
                            .then( response => {
                                       this.reload( 5 );
                                   },
                                   error => {
                                       alert( 'error3: ' + error.toString() );
                                   }
                            );
                    }
                    // es gibt inzwischen schon ein höheres Gebot
                    else {
                        NotificationService.warn( "STATUS:<br>Es gibt inzwischen ein höheres Gebot..." ).close;
                        this.reload( 2600 ); // :)
                    }
                } )
                .fail( () => {
                           alert( 'Upps - ein Fehler bei auctionbidprice ??!!' );
                       }
                )
        },
        evaluateAndNotify() {
            if ( this.hasLoggedInUserTheLastBid() ) {
                // vorletztes Gebot auch von mir ? - entweder mein MaxGebot geändert, oder unterlegenes Gebot... ?
                if ( this.auction.bidderList[this.auction.bidderList.length - 2].customerId == this.userdata.id + MINI_CRYPT ) {
                    switch ((this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus).toString()) {
                        case AuctionConstants.OWN_BID_CHANGED: {
                            NotificationService.info( "STATUS:<br>Sie haben Ihr eigenes Maximal-Gebot verändert!" )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                        case AuctionConstants.LOWER_BID: {
                            NotificationService.success(
                                "STATUS:<br>Es wurde ein geringeres Gebot abgegeben... <br> Sie sind aber immer noch Höchstbietende(r)..." )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                    }
                }
                else {
                    // bidStatus von letzter bid ???
                    console.log( 'bidStatus von letzter bid' );
                    switch ((this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus).toString()) {
                        case AuctionConstants.OWN_BID_CHANGED: {
                            NotificationService.info( "STATUS:<br>Sie haben Ihr eigenes Maximal-Gebot verändert!" )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                        case AuctionConstants.HIGHEST_BID: {
                            NotificationService.success( "GLÜCKWUNSCH:<br>Sie sind Höchstbietende(r)..." )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                        case AuctionConstants.LOWER_BID: {
                            NotificationService.warn( "STATUS:<br>Es wurde inzwischen ein höheres Gebot abgegeben..." )
                                .closeAfter( NOTIFY_TIME );

                            break;
                        }
                            console.log( 'keine Info / bidStatus ?????: ' );
                    }
                }
            }
            else {
                NotificationService.warn( "STATUS:<br>Es gibt leider ein höheres Gebot..." ).closeAfter( NOTIFY_TIME );
            }
        },
        hasLoggedInUserBiddenYet() {
            // return true if LoggedInUser in BidderList (foreach... break wenn gefunden)
            for (var i = this.auction.bidderList.length; --i > 0;) {
                if ( this.userdata.id + MINI_CRYPT == this.auction.bidderList[i].customerId ) {
                    return true;
                }
            }
            return false;
        },
        hasLoggedInUserTheLastBid() {
            // return true if lastBid.CustomerId == loggedInCustomerID
            if ( this.auction.bidderList[this.auction.bidderList.length - 1].customerId == this.userdata.id + MINI_CRYPT ) {
                return true
            }
            else {
                return false
            }
        },
        toFloatTwoDecimal(value) {
            return Math.round( parseFloat( value ) * 100 ) / 100.0
        },

        auctionend() {

            // var startD  = Math.trunc( (new Date()).getTime() / 1000 );
            // startD      = startD - 24 * 60 * 60 + 7;
            // var Bidtest = {
            //     "startDate": startD,
            //     "startHour": 16,
            //     "startMinute": 45,
            //     "auctionDuration": 1,
            //     "startPrice": this.minBid - 2
            // };
            //
            // ApiService.put( "/api/auction/34", JSON.stringify( Bidtest ), { contentType: "application/json" }
            // )
            //     .done( auction => {
            //         // alert( "ok" );
            //     } )
            //     .fail( () => {
            //         alert( 'Upps - ein Fehler beim auctionend ??!!' );
            //     } );
        },
        afterAuction() {
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
        },
        reload(timeout) {
            setTimeout( () => {
                location.reload();
            }, timeout );
        },
        getCurrentBidPrice() {

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
                        .closeAfter( 5000 );
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
