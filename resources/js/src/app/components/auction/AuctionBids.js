const ApiService          = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );
const AuctionConstants    = require( "constants/AuctionConstants" );
const ResourceService     = require( "services/ResourceService" );

const NOTIFY_TIME = 10000;

Vue.component( "auction-bids", {
    props: [
        "template",
        "userdata",
        "auction",
        "minbid",
        "auctionEnd",
        "item",
        "deadline"
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
        this.userdata = JSON.parse( this.userdata );

        this.item = JSON.parse( this.item );

        this.auction  = JSON.parse( this.auction );
        this.deadline = parseInt( this.auction.expiryDate );
        this.minbid   = this.toFloatTwoDecimal( ( ( this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice ) ) + 1 );
    },
    ready() {
        // tense "present" und Customer loggedIn ??
        if ( this.auction.tense == AuctionConstants.PRESENT && this.userdata != null ) {
            // Auswertung für Bieter in Bidderlist bzw. auch für den gerade in Session gespeicherten User... ???!!
            if ( this.hasLoggedInUserBiddenYet() || sessionStorage.getItem( "currentBidder" ) == this.userdata.id ) {
                this.liveEvaluateAndNotify();
            }
        }
    },
    methods: {

        addBid() {
            ApiService.get( "/api/calctime/" + this.auction.startDate + '/' + this.auction.expiryDate )
                .done( tenseFromServer => {
                    const tense = tenseFromServer;
                    // Absicherung mit Server Time, dass Auktion noch 'present' ist
                    if ( tense == AuctionConstants.PRESENT ) {
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
                    }
                    else {
                        // ToDO Modal mit Time 5sec
                        this.printClockWarn();
                        this.afterAuctionWithServerTensePast();
                    }
                } )
                .fail( () => {
                           alert( 'Upps - ein Fehler bei der Zeitabfrage ??!!' );
                       }
                )

        },
        liveEvaluateAndNotify() {
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
            startD      = startD - 24 * 60 * 60 + 10;
            var Bidtest = {
                "startDate": startD,
                "startHour": 16,
                "startMinute": 45,
                "auctionDuration": 1,
                "startPrice": this.minbid - 2
            };
            const url = "/api/auction/" + this.auction.id;
            ApiService.put( url, JSON.stringify( Bidtest ), { contentType: "application/json" }
            )
                .done( auction => {
                    // alert( "ok" );
                } )
                .fail( () => {
                    alert( 'Upps - ein Fehler beim auctionend ??!!' );
                } );
        },
        afterAuctionWithFrontendTime(counter, tense) {
            if ( counter == 5 ) {
                // ToDO Modal mit Time 5sec
                this.printClockWarn();
                // Todo: Wiederholung unterbinden !!
                this.reload( 10 );
            }
            else {
                // im Frontend-Browser abgelaufen, aber auf dem Server noch nicht
                ApiService.get( "/api/calctime/" + this.auction.startDate + '/' + this.auction.expiryDate )
                    .done( tensefromServer => {
                        tense = tensefromServer;

                        if ( tense == AuctionConstants.PAST ) {
                            this.afterAuctionWithServerTensePast();
                        }
                        else {
                            counter++;
                            if ( counter > 2 ) {
                                NotificationService.warn(
                                    "<h3>STATUS:</h3><hr>Abgleich Auktions-Serverzeit mit aktueller Computerzeit..." )
                                    .closeAfter( 3000 );
                            }
                            setTimeout( () => {
                                this.afterAuctionWithFrontendTime( counter, tense );
                            }, (counter * 1000 + 2000) );
                        }
                    } )
                    .fail( () => {
                               alert( 'Ein Fehler in afterAuctionWithFrontendTime  ??!!' );
                           }
                    )
            }
        },
        afterAuctionWithServerTensePast() {
            if ( this.userdata != null ) {
                ApiService.get( "/api/auction_last_entry/" + this.auction.id )
                    .done( lastEntry => {

                        const bidderListLastEntry = lastEntry;

                        // Gewinner eingeloggt?
                        if ( this.userdata.id == bidderListLastEntry.customerId ) {
                            // Artikel in den Warenkorb
                            const url = ('/auction_to_basket?number=' + this.item['variation']['id'])
                            ApiService.post( url )
                                .done( response => {

                                    const result = JSON.parse( response );

                                    if ( result == this.item['variation']['id'] ) {
                                        // flag für Uhrzeit Differenz ???
                                        this.reload( 10 );
                                        sessionStorage.setItem( "basketItem", this.auction.itemId );
                                    }
                                    else {
                                        alert(
                                            'Ein Fehler ist aufgetreten:\nBitte sehen Sie in Ihre Emails bzw. wenden Sie sich an unseren Kundendienst (s.Kontakt auf dieser Website)' )
                                    }
                                } )
                                .fail( () => {
                                           alert( 'Oops - Fehler bei Auction Auswertung 2 ??!!' );
                                       }
                                )
                        }
                        // Nichtgewinner angemeldet...
                        else {
                            this.reload( 10 );
                        }
                    } )
                    .fail( () => {
                               alert( 'Fehler bei After Auction 1 ??!!' );
                           }
                    )
            }
            // niemand angemeldet...
            else {
                this.reload( 10 );
            }
            // }
        },
        reload(timeout) {
            setTimeout( () => {
                location.reload();
            }, timeout );
        },
        printClockWarn() {
            alert(
                'Bitte überprüfen Sie die Uhrzeit Ihres Computers!\n' +
                '(Diese sollte in den System-Einstellungen auf automatisch (über das Internet) eingestellt werden)\n' +
                'Die Serverzeit für diese Auktion unterscheidet sich signifikant von der dieses Computers!')
        }
    },
    watch: {
        maxCustomerBid: function () {
            if ( this.maxCustomerBid > 0 && this.userdata == null ) {
                NotificationService.error(
                    { "message": "Bitte loggen Sie sich ein<br>bzw. registrieren Sie sich!" } )
                    .closeAfter( 5000 );
                this.isInputValid = false;
            }
            if ( this.maxCustomerBid >= this.minbid && this.userdata != null ) {
                this.isInputValid = true
            }
            else {
                this.isInputValid = false;
            }
        },
        auctionEnd: function () {
            if ( this.auctionEnd ) {
                var tense   = AuctionConstants.PRESENT;
                var counter = 0
                this.afterAuctionWithFrontendTime( counter, tense );
            }
        }
    },
} );
