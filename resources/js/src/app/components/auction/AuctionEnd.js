const ApiService          = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );
const AuctionConstants    = require( "constants/AuctionConstants" );
const NOTIFY_TIME         = 10000;

Vue.component( "auction-end", {
    props: [
        "template",
        "userdata",
        "auctionid",
        "isWinnerLoggedIn",
        "bidderList"
    ],
    data() {
        return {}
    },
    created() {
        this.$options.template = this.template;
    },
    compiled() {
        this.userdata = JSON.parse( this.userdata );
        this.auctionid  = parseInt( this.auctionid );
    },
    ready() {
        // User loggedIn ??
        if ( this.userdata != null ) {
            this.evaluateAndNotifyAfterAuction();
        }
        if ( sessionStorage.getItem( "auctionEnd" ) ) {
            sessionStorage.removeItem( "auctionEnd" );
        }
    },
    methods: {
        evaluateAndNotifyAfterAuction() {
            // ToDo - Uhrzeit überprüfen mit Sessionstorage/bei Wiederholung und Hinweis auf Uhr stellen...
            ApiService.get( "/api/bidderlist/" + this.auctionid )
                .done( response => {
                    this.bidderList = response;

                    // Gewinner eingeloggt ??
                    if ( this.bidderList[this.bidderList.length - 1].customerId == this.userdata.id ) {
                        this.isWinnerLoggedIn = true;
                        NotificationService.success(
                            "<h3>Herzlichen Glückwunsch!</h3><hr>" +
                            "Sie haben diese Auktion gewonnen!<br>Sie können jetzt zur Kasse gehen." )
                            .closeAfter( NOTIFY_TIME );
                    }
                    // Anderer User eingeloggt
                    else {
                        this.isWinnerLoggedIn = false;
                        // ist der eingeloggte User in BidderList
                        if ( this.hasLoggedInUserBiddenYet() == true ) {
                            NotificationService.error(
                                "<h3>STATUS:</h3><hr>Leider wurden Sie überboten...<br>Wir wünschen mehr Glück bei einer nächsten Auktion." )
                                .closeAfter( NOTIFY_TIME );
                        }
                        // nein
                        else {
                            NotificationService.info( "<h3>STATUS:</h3><hr>Bei dieser Auktion haben Sie nicht mitgeboten." )
                                .closeAfter( NOTIFY_TIME );
                        }
                    }
                } )
                .fail( () => {
                           alert( 'Oops - Fehler bei get last bid ??!!' );
                       }
                )
        },

        hasLoggedInUserBiddenYet() {
            // return true if LoggedInUser in BidderList (foreach... break wenn gefunden)
            for (var i = this.bidderList.length; --i > 0;) {
                // console.log( 'this.userdata.id: ' + this.userdata.id + i + 'customerid' + this.bidderList[i].customerId );
                if ( this.userdata.id == this.bidderList[i].customerId ) {
                    return true;
                }
            }
            return false;
        }
    }
} )