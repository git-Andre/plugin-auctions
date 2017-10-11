const ApiService           = require( "services/ApiService" );
const NotificationService  = require( "services/NotificationService" );
const AuctionConstants     = require( "constants/AuctionConstants" );
// const AuctionBidderService = require( "services/AuctionBidderService" );

// (mini encrypt() ToDo: richtig verschlüsseln - evtl. auch die MaxBids für späteren Gebrauch (KundenKonto) s. server- php
const NOTIFY_TIME = 10000;

Vue.component( "auction-bids", {
    props: [
        "template",
        "userdata",
        "auction",
        "minbid",
        "auctionEnd",
        "item"
    ],
    data() {
        return {
            // auction: {},
            isInputValid: false,
            maxCustomerBid: null
        }
    },
    created() {
        this.$options.template = this.template;
    },
    compiled() {
        this.userdata = JSON.parse( this.userdata );
        this.item     = JSON.parse( this.item );

        // this.currentBid = {};
    },
    ready() {
        this.auction            = JSON.parse( this.auction );
        this.auction.expiryDate = parseInt( this.auction.expiryDate );

        this.minbid = this.toFloatTwoDecimal( ( ( this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice ) ) + 1 );

        // tense "present" und Customer loggedIn ??
        if ( (this.auction.tense == AuctionConstants.PRESENT || this.auction.tense == AuctionConstants.PAST) &&
            this.userdata != null ) {
            // Auswertung für Bieter in Bidderlist bzw. auch für den gerade in Session gespeicherten User... ???!!
            if ( this.hasLoggedInUserBiddenYet() || sessionStorage.getItem( "currentBidder" ) == this.userdata.id ) {
                this.evaluateAndNotify();
            }
        }
        else {
            if ( (this.auction.tense == AuctionConstants.PAST) && this.userdata != null ) {

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
                        sessionStorage.setItem( "currentBidder", this.userdata.id );

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
                        NotificationService.warn(
                            // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                            "<h3>STATUS:</h3><hr>Es wurde schon ein höheres Maximal-Gebot abgegeben..." )
                            .close;
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
                if ( this.auction.bidderList[this.auction.bidderList.length - 2].customerId == this.userdata.id ) {
                    switch ((this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus).toString()) {
                        case AuctionConstants.OWN_BID_CHANGED: {
                            NotificationService.info(
                                // "<span><i class=\"fa fa-info-circle p-l-0 p-r-1\"></span>" +
                                "<h3>Letzte Aktion:</h3><hr>" +
                                "Sie haben Ihr eigenes Maximal-Gebot geändert!" )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                        case AuctionConstants.LOWER_BID: {
                            NotificationService.success( {
                                                             "message":
                                                             // "<i class=\"fa fa-check-circle p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                                             "<h3>STATUS:</h3><hr>Es wurde ein geringeres Maximal-Gebot abgegeben... " +
                                                             "<br> Sie sind aber immer noch Höchstbietende(r)..."
                                                         } )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                    }
                }
                else {
                    // bidStatus von letzter bid ???
                    switch ((this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus).toString()) {
                        case AuctionConstants.OWN_BID_CHANGED: {
                            NotificationService.info(
                                // "<i class=\"fa fa-info-circle p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                "<h3>STATUS:</h3><hr>Sie haben Ihr eigenes Maximal-Gebot verändert!" )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                        case AuctionConstants.HIGHEST_BID: {
                            NotificationService.success(
                                // "<i class=\"fa fa-check-circle-o p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                "<h3>GLÜCKWUNSCH:</h3><hr>Sie sind derzeit Höchstbietende(r)..." )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                        case AuctionConstants.LOWER_BID: {
                            NotificationService.warn(
                                // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                "<h3>STATUS:</h3><hr>Es wurde schon ein höheres Maximal-Gebot abgegeben..." )
                                .closeAfter( NOTIFY_TIME );

                            break;
                        }
                            console.log( 'keine Info / bidStatus ?????: ' );
                    }
                }
            }
            else {
                NotificationService.warn(
                    // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                    "<h3>STATUS:</h3><hr>Es wurde schon ein höheres Maximal-Gebot abgegeben..." )
                    .closeAfter( NOTIFY_TIME );
            }
            /**/
            sessionStorage.removeItem( "currentBidder" );
        },
        hasLoggedInUserBiddenYet() {
            // return true if LoggedInUser in BidderList (foreach... break wenn gefunden)
            for (var i = this.auction.bidderList.length; --i > 0;) {
                if ( this.userdata.id == this.auction.bidderList[i].customerId ) {
                    return true;
                }
            }
            return false;
        },
        hasLoggedInUserTheLastBid() {
            // return true if lastBid.CustomerId == loggedInCustomerID
            if ( this.auction.bidderList[this.auction.bidderList.length - 1].customerId == this.userdata.id ) {
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
            var startD  = Math.trunc( (new Date()).getTime() / 1000 );
            startD      = startD - 24 * 60 * 60 + 7;
            var Bidtest = {
                "startDate": startD,
                "startHour": 16,
                "startMinute": 45,
                "auctionDuration": 1,
                "startPrice": this.minbid - 2
            };

            ApiService.put( "/api/auction/11", JSON.stringify( Bidtest ), { contentType: "application/json" }
            )
                .done( auction => {
                    // alert( "ok" );
                } )
                .fail( () => {
                    alert( 'Upps - ein Fehler beim auctionend ??!!' );
                } );
        },
        help() {
            // ApiService.post( "/rest/orders", JSON.stringify( orderBuilder ), { contentType: "application/json" }
//api/placeorder/{auctionId}
//             ApiService.post( "/api/placeorder", { "auctionid": this.auction.id }, { contentType: "application/json" }
//             )
//                 .done( auction => {
//                     console.dir( auction );
//                     alert( "ok" );
//                 } )
//                 .fail( () => {
//                     alert( 'Upps - AUTH (mist) ??!!' );
//                 } );
//
//             ApiService.get( "/api/placeorder/" + this.auction.Id
//             )
//                 .done( auction => {
//                     console.dir( auction );
//                     alert( "ok" );
//                     // this.reload( 10 );
//
//                 } )
//                 .fail( () => {
//                     alert( 'Upps - Gewinner eingeloggt - aber... ???!!' );
//                 } );
//

        },

        afterAuction() {

            // um Probleme mit letzten Geboten bei geringen Zeitunterschieden zu umgehen
            setTimeout( () => {
                if ( this.userdata ) {
                    const currentUserId = this.userdata.id;
                    const lastEntry     = true;

                    ApiService.get( "/api/auction_last_entry/" + this.auction.id )
                        .done( response => {

                            const bidderListLastEntry = response;

                            const variationId = this.item['variation']['id'];

                            // Gewinner eingeloggt (UND es gab Gebote - ToDo: kann weg)??
                            if ( currentUserId == bidderListLastEntry.customerId &&
                                this.auction.startPrice != bidderListLastEntry.bidPrice ) {
                                const url = ('/auction_to_basket?number=' + variationId)

                                ApiService.post( url )
                                    .done( response => {
                                        console.dir( response );

                                        // this.reload( 10 );
                                    } )
                                    .fail( () => {
                                               alert( 'Upps - ein Fehler bei Auction After 2 ??!!' );
                                           }
                                    )

                            }
                            // Gewinner nicht eingeloggt !!
                            else {
                                this.reload( 10 );
                            }
                        } )
                        .fail( () => {
                                   alert( 'Upps - ein Fehler bei Auction After ??!!' );
                               }
                        )
                }
                else {
                    NotificationService.warn( "Nicht angemeldet... -> reload" ).close;
                    this.reload( 3000 );
                }
            }, 1000 );
        },
        help2() {
            // geparkt für evaluate & notify

            // Gewinner eingeloggt ??
            if ( currentUserId == lastUserId ) {
                NotificationService.success(
                    "Herzlichen Glückwunsch!<br>Sie haben diese Auktion gewonnen!<br>Sie können jetzt zur Kasse gehen." )
                    .close;
                alert( "  // item -> Basket\n" + "// Url -> Checkout" )
                // item -> Basket
                // Url -> Checkout
            }
            // Gewinner nicht eingeloggt !!
            else {
                var isUserInBidderList = false;

                for (var i = bidderList.length; --i > 0;) {
                    const userId = bidderList[i].customerId;

                    if ( currentUserId == userId ) {
                        isUserInBidderList = true;
                        break
                    }
                }
                // ist der eingeloggte User in BidderList
                if ( isUserInBidderList ) {
                    NotificationService.error(
                        "Leider wurden Sie überboten...<br>Wir wünschen mehr Glück bei einer nächsten Auktion." ).close;
                    this.reload( 3000 );
                }
                // nein
                else {
                    NotificationService.info( "Bei dieser Auktion haben Sie nicht mitgeboten." ).close;
                    this.reload( 3000 );
                }
            }

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
            if ( this.maxCustomerBid >= this.minbid ) {
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
} );
