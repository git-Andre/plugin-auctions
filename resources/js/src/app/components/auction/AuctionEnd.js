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
        this.getBidderList();
    },
    ready() {

        console.log( 'this.auction.tense: ' + this.auction.tense );
        console.log( 'this.auctionid: ' + this.auctionid );

        // Customer loggedIn ??
        if ( this.userdata != null ) {
            console.log( 'Customer loggedIn' );
            this.evaluateAndNotifyAfterAuction();
        }
    },
    methods: {
        getBidderList() {
            ApiService.get( "/api/bidderlist/" + this.auctionid )
                .done( response => {

                    this.bidderList = response;
                    console.dir( this.bidderList );
                } )
                .fail( () => {
                           alert( 'Oops - Fehler bei get last bid ??!!' );
                       }
                )

        },
        evaluateAndNotifyAfterAuction() {
            // Gewinner eingeloggt ??
            if ( this.isWinnerLoggedIn ) {
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
            for (var i = this.bidderList.length; --i > 0;) {
                if ( this.userdata.id == this.bidderList[i].customerId ) {
                    return true;
                }
            }
            return false;
        },
        // hasLoggedInUserTheLastBid() {
        //     // return true if lastBid.CustomerId == loggedInCustomerID
        //     if ( this.bidderList[this.bidderList.length - 1].customerId == this.userdata.id ) {
        //         return true
        //     }
        //     else {
        //         return false
        //     }
        // },
    },
    watch: {
        isWinnerLoggedIn: function () {
            if ( this.bidderList[this.bidderList.length - 1].customerId == this.userdata.id ) {
                    this.isWinnerLoggedIn = true
            }
            else {
                this.isWinnerLoggedIn = false;
            }
        },
    },
} )