const ApiService          = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );
const AuctionConstants    = require( "constants/AuctionConstants" );
// const ModalService        = require("services/ModalService");

// const ResourceService     = require("services/ResourceService");

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
            maxCustomerBid: null
        };
    },
    created() {
        this.$options.template = this.template;
    },
    compiled() {
        this.userdata = JSON.parse( this.userdata );

        this.item = JSON.parse( this.item );

        this.auction  = JSON.parse( this.auction );
        this.deadline = parseInt( this.auction.expiryDate );
        this.minbid   = this.toFloatTwoDecimal( ((this.auction.bidderList[this.auction.bidderList.length - 1].bidPrice)) + 1 );
    },
    ready() {
        // tense "present" und Customer loggedIn ??
        if ( this.auction.tense == AuctionConstants.PRESENT && this.userdata != null ) {
            // Auswertung für Bieter in Bidderlist bzw. auch für den gerade in Session gespeicherten User... ???!!
            if ( this.hasLoggedInUserBiddenYet() || sessionStorage.getItem( "currentBidder" ) == this.userdata.id ) {
                this.liveEvaluateAndNotify();
            }
        };

        // this.bankInfoModal = ModalService.findModal(this.$els.bankInfoModal);

    },
    methods: {

        confirmBid() {
            // alert('ok - hier');
            // var $modal     = $( this.$els.auctionBidConfirmModal );
            var $modalBody = $( this.$els.auctionBidConfirmModalContent );

            $modalBody.html( "<p>test</p>" );

            $("#auctionBidConfirmModal").modal( "show" );
        },

        addBid() {
            ApiService.get( "/auctions/calctime/" + this.auction.startDate + "/" + this.auction.expiryDate )
                .done( tenseFromServer => {
                    const tense = tenseFromServer;
                    // Absicherung mit Server Time, dass Auktion noch 'present' ist

                    if ( tense == AuctionConstants.PRESENT ) {
                        ApiService.get( "/auctions/lastbidprice/" + this.auction.id )
                            .done( lastBidPrice => {
                                // ist es ein gültiges Gebot (höher als letztes Gebot) ?
                                if ( this.maxCustomerBid > this.toFloatTwoDecimal( lastBidPrice ) ) {

                                    const pos           = this.userdata.email.indexOf( "@" );
                                    const newBidderName = this.userdata.email.slice( 0, 2 ) + " *** " +
                                        this.userdata.email.slice( pos - 2, pos );

                                    var currentBid = {
                                        customerMaxBid: this.toFloatTwoDecimal( this.maxCustomerBid ),
                                        bidderName: newBidderName,
                                        customerId: parseInt( this.userdata.id )
                                    };

                                    // super Time Tunnel
                                    sessionStorage.setItem( "currentBidder", this.userdata.id );

                                    ApiService.put( "/auctions/bidderlist/" + this.auction.id, JSON.stringify( currentBid ),
                                                                                               { contentType: "application/json" }
                                    )
                                        .then( response => {
                                                   if ( response.indexOf( "Fehler" ) >= 0 ) {
                                                       NotificationService.error( response ).close;
                                                   }
                                                   else {
                                                       NotificationService.success(
                                                           "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.successBid ).close;
                                                   }
                                                   this.reload( 2000 );
                                               },
                                               error => {
                                                   NotificationService.error( "error31: " + error.toString() )
                                                       .closeAfter( NOTIFY_TIME );
                                               }
                                        );
                                }
                                // es gibt inzwischen schon ein höheres Gebot
                                else {
                                    // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                    NotificationService.warn(
                                        "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionIsHigherMaxBid )
                                        .close;
                                    this.reload( 5000 );
                                }
                            } )
                            .fail( () => {
                                       NotificationService.error( "Upps - ein Fehler bei auctionbidprice ??!!" ).close;
                                   }
                            );
                    }
                    else {
                        // ToDO Modal mit Time 5sec
                        this.printClockWarn();
                        this.afterAuctionWithServerTensePast();
                    }
                } )
                .fail( () => {
                           NotificationService.error( "Upps - ein Fehler bei der Zeitabfrage ??!!" ).close;
                       }
                );
        },
        liveEvaluateAndNotify() {
            if ( this.hasLoggedInUserTheLastBid() ) {
                // vorletztes Gebot auch von mir ? - entweder mein MaxGebot geändert, oder unterlegenes Gebot... ?
                if ( this.auction.bidderList[this.auction.bidderList.length - 2].customerId == this.userdata.id ) {
                    switch ((this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus).toString()) {
                        case AuctionConstants.OWN_BID_CHANGED: {
                            NotificationService.info(
                                "<h3>" + TranslationsAo.Template.auctionlastAction + "</h3><hr>" +
                                TranslationsAo.Template.auctionChangedOwnMaxBid )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                        case AuctionConstants.LOWER_BID: {
                            // "<i class=\"fa fa-check-circle p-l-1 p-r-1\" aria-hidden=\"true\">" +
                            NotificationService.success(
                                "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionLowerMaxBid )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                    }
                }
                else {
                    // bidStatus von letzter bid ???
                    switch ((this.auction.bidderList[this.auction.bidderList.length - 1].bidStatus).toString()) {
                        case AuctionConstants.OWN_BID_CHANGED: {
                            // "<i class=\"fa fa-info-circle p-l-1 p-r-1\" aria-hidden=\"true\">" +
                            NotificationService.info(
                                "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionChangedOwnMaxBid )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                        case AuctionConstants.HIGHEST_BID: {
                            NotificationService.success(
                                // "<i class=\"fa fa-check-circle-o p-l-1 p-r-1\" aria-hidden=\"true\">" +
                                "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionYouHaveHighestBid )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                        case AuctionConstants.LOWER_BID: {
                            // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                            NotificationService.warn(
                                "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionIsHigherMaxBid )
                                .closeAfter( NOTIFY_TIME );
                            break;
                        }
                    }
                }
            }
            else {
                NotificationService.warn(
                    // "<i class=\"fa fa-warning p-l-1 p-r-1\" aria-hidden=\"true\">" +
                    "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionIsHigherMaxBid )
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
                return true;
            }
            return false;
        },
        toFloatTwoDecimal(value) {
            return Math.round( parseFloat( value ) * 100 ) / 100.0;
        },

        auctionend() {
            var startD = Math.trunc( (new Date()).getTime() / 1000 );

            startD      = startD - 24 * 60 * 60 + 10;
            var Bidtest = {
                startDate: startD,
                startHour: 16,
                startMinute: 45,
                auctionDuration: 1,
                startPrice: this.minbid - 2
            };
            const url   = "/api/auction/" + this.auction.id;

            ApiService.put( url, JSON.stringify( Bidtest ), { contentType: "application/json" }
            )
                .done( auction => {
                    // alert( "ok" );
                } )
                .fail( () => {
                    NotificationService.error( "Upps - ein Fehler beim auctionend ??!!" ).close;
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
                ApiService.get( "/auctions/calctime/" + this.auction.startDate + "/" + this.auction.expiryDate )
                    .done( tensefromServer => {
                        tense = tensefromServer;

                        if ( tense == AuctionConstants.PAST ) {
                            this.reload( 100 );
                            // this.afterAuctionWithServerTensePast();
                        }
                        else {
                            counter++;
                            if ( counter > 2 ) {
                                NotificationService.warn(
                                    "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionMatchServerTime )
                                    .closeAfter( 3000 );
                            }
                            setTimeout( () => {
                                this.afterAuctionWithFrontendTime( counter, tense );
                            }, (counter * 1000 + 2000) );
                        }
                    } )
                    .fail( () => {
                               NotificationService.error( "Ein Fehler in afterAuctionWithFrontendTime  ??!!" ).close;
                           }
                    );
            }
        },
        afterAuctionWithServerTensePast() {
            if ( this.userdata != null ) {
                ApiService.get( "/auctions/lastentry/" + this.auction.id )
                    .done( lastEntry => {

                        const bidderListLastEntry = lastEntry;

                        // Gewinner eingeloggt?
                        if ( this.userdata.id == bidderListLastEntry.customerId ) {
                            // Artikel in den Warenkorb
                            const url = ("/auction_to_basket?number=" + this.item.variation.id + "&auctionid=" + this.auction.id);

                            ApiService.post( url )
                                .done( response => {

                                    const result = JSON.parse( response );

                                    if ( result == this.item.variation.id ) {
                                        sessionStorage.setItem( "basketItem", this.auction.itemId );
                                        this.reload( 10 );
                                    }
                                    else {
                                        NotificationService.error(
                                            "Ein Fehler ist aufgetreten:\nBitte sehen Sie in Ihre Emails bzw. wenden Sie sich an unseren Kundendienst (s.Kontakt auf dieser Website)" ).close;
                                    }
                                } )
                                .fail( () => {
                                           alert( "Oops - Fehler bei Auction Auswertung 2 ??!!" );
                                       }
                                );
                        }
                        // Nichtgewinner angemeldet...
                        else {
                            this.reload( 10 );
                        }
                    } )
                    .fail( () => {
                               alert( "Fehler bei After Auction 1 ??!!" );
                           }
                    );
            }
            // niemand angemeldet...
            else {
                this.reload( 10 );
            }
        },
        reload(timeout) {
            setTimeout( () => {
                location.reload();
            }, timeout );
        },
        printClockWarn() {
            NotificationService.error( "Bitte überprüfen Sie ggf. die Uhrzeit Ihres Computers!<br>" +
                "(Diese sollte in den System-Einstellungen auf automatisch (über das Internet) eingestellt werden)<br>" +
                "Die Serverzeit für diese Auktion unterscheidet sich von der dieses Computers!" ).close;
        },
    },
    watch: {
        maxCustomerBid: function () {

            if ( this.maxCustomerBid > 0 && this.userdata == null ) {
                NotificationService.error( TranslationsAo.Template.auctionPleaseLogin ).closeAfter( 5000 );
                this.isInputValid = false;
            }
            if ( this.maxCustomerBid >= this.minbid && this.userdata != null ) {
                this.isInputValid = true;
            }
            else {
                this.isInputValid = false;
            }
        },
        auctionEnd: function () {
            if ( this.auctionEnd ) {
                var tense   = AuctionConstants.PRESENT;
                var counter = 0;

                this.afterAuctionWithFrontendTime( counter, tense );
            }
        }
    }
} );
