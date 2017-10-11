const ApiService          = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );
const AuctionConstants    = require( "constants/AuctionConstants" );
const NOTIFY_TIME         = 10000;

Vue.component( "auction-end", {
    props: [
        "template",
        "userdata",
        "auction"
    ],
    data() {
        return {}
    },
    created() {
        this.$options.template = this.template;
    },
    compiled() {
        this.userdata = JSON.parse( this.userdata );
        this.auction  = JSON.parse( this.auction );
    },
    ready() {

        console.log( 'this.auction.tense: ' + this.auction.tense );
        console.log( 'this.userdata.id: ' + this.userdata.id );

        // tense "past" und Customer loggedIn ??
        if ( this.auction.tense == AuctionConstants.PAST && this.userdata.id > 0 ) {
            console.log( 'tense "past" und Customer loggedIn' );
            this.evaluateAndNotifyAfterAuction();
        }
    },
    methods: {
        evaluateAndNotifyAfterAuction() {
            // Gewinner eingeloggt ??
            if ( this.hasLoggedInUserTheLastBid() ) {
                console.log( 'Gewinner eingeloggt' );
                NotificationService.success(
                    "<h3>Herzlichen Glückwunsch!</h3><hr>" +
                    "Sie haben diese Auktion gewonnen!<br>Sie können jetzt zur Kasse gehen." )
                    .closeAfter( NOTIFY_TIME );
            }
            // Anderer User eingeloggt
            else {
                // ist der eingeloggte User in BidderList
                if ( hasLoggedInUserBiddenYet ) {
                    console.log( 'ist der eingeloggte User in BidderList' );
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
    }
} )