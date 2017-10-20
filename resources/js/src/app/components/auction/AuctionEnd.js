const ApiService = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );
const AuctionConstants = require( "constants/AuctionConstants" );
const NOTIFY_TIME = 10000;

Vue.component( "auction-end", {
    props: [
        "template",
        "userdata",
        "auction",
        "isWinnerLoggedIn"
    ],
    data() {
        return {}
    },
    created() {
        this.$options.template = this.template;
    },
    compiled() {
        this.userdata = JSON.parse( this.userdata );
        this.auction = JSON.parse( this.auction );
    },
    ready() {
        // User loggedIn ??
        if ( this.userdata != null ) {
            this.evaluateAndNotifyAfterAuction();
        }
        // if ( sessionStorage.getItem( "auctionEnd" ) ) {
        //     sessionStorage.removeItem( "auctionEnd" );
        // }
    },
    methods: {
        evaluateAndNotifyAfterAuction() {

            // Gewinner eingeloggt ??
            if ( this.auction.bidderList[this.auction.bidderList.length - 1].customerId == this.userdata.id ) {

                // if ( sessionStorage.getItem( "basketItem" ) == parseInt( this.auction.itemId ) ) {
                //     this.isWinnerLoggedIn = true;
                //     NotificationService.success(
                //         "<h3>Herzlichen Glückwunsch!</h3><hr>" +
                //         "Sie haben diese Auktion gewonnen!<br>Sie können jetzt zur Kasse gehen." )
                //         .closeAfter( NOTIFY_TIME );
                //     setTimeout( () => {
                //         sessionStorage.removeItem( "basketItem" );
                //     }, (2000) );
                // }
                // else {
                //     this.isWinnerLoggedIn = false;
                //     NotificationService.success(
                //         "<h3>Herzlichen Glückwunsch!</h3><hr>" +
                //         "Sie haben diese Auktion gewonnen!<br>Sie erhalten in Kürze eine Email." )
                //         .closeAfter( NOTIFY_TIME );
                //     sessionStorage.removeItem( "basketItem" );
                // }
                this.isWinnerLoggedIn = false;
                NotificationService.success(
                    "<h3>Herzlichen Glückwunsch!</h3><hr>" +
                    "Sie haben diese Auktion gewonnen!<br>Sie erhalten in Kürze eine Email." )
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
                sessionStorage.removeItem( "basketItem" );
            }
        },

        hasLoggedInUserBiddenYet() {
            // return true if LoggedInUser in BidderList (foreach... break wenn gefunden)
            for (var i = this.auction.bidderList.length; --i > 0;) {
                // console.log( 'this.userdata.id: ' + this.userdata.id + i + 'customerid' + this.auction.bidderList[i].customerId );
                if ( this.userdata.id == this.auction.bidderList[i].customerId ) {
                    return true;
                }
            }
            return false;
        }
    }
} )