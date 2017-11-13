// const ApiService = require("services/ApiService");
const NotificationService = require( "services/NotificationService" );
// const AuctionConstants = require("constants/AuctionConstants");
const NOTIFY_TIME         = 10000;

Vue.component( "auction-end", {
    props: [
        "template",
        "userdata",
        "auction",
        "isWinnerLoggedIn"
    ],
    data() {
        return {};
    },
    created() {
        this.$options.template = this.template;
    },
    compiled() {
        this.userdata = JSON.parse( this.userdata );
        this.auction  = JSON.parse( this.auction );
    },
    ready() {
        // User loggedIn ??
        if ( this.userdata !== null ) {
            this.evaluateAndNotifyAfterAuction();
        }
    },
    methods: {
        evaluateAndNotifyAfterAuction() {

            // Gewinner eingeloggt ??
            if ( this.auction.bidderList[this.auction.bidderList.length - 1].customerId === this.userdata.id ) {
                // this.isWinnerLoggedIn = true;
                NotificationService.success( TranslationsAo.Template.auctionEndCongratulations )
                    .closeAfter( NOTIFY_TIME );
            }
            // Anderer User eingeloggt
            else {
                // this.isWinnerLoggedIn = false;
                // ist der eingeloggte User in BidderList
                if ( this.hasLoggedInUserBiddenYet() === true ) {
                    NotificationService.error(
                        "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionUnfortunalyOutbid )
                        .closeAfter( NOTIFY_TIME );
                }
                // nein
                else {
                    NotificationService.info( "<h3>STATUS:</h3><hr>" + TranslationsAo.Template.auctionNotBid )
                        .closeAfter( NOTIFY_TIME );
                }
                sessionStorage.removeItem( "basketItem" );
            }
        },

        hasLoggedInUserBiddenYet() {
            // return true if LoggedInUser in BidderList (foreach... break wenn gefunden)
            for (var i = this.auction.bidderList.length; --i > 0;) {
                // console.log( 'this.userdata.id: ' + this.userdata.id + i + 'customerid' + this.auction.bidderList[i].customerId );
                if ( this.userdata.id === this.auction.bidderList[i].customerId ) {
                    return true;
                }
            }
            return false;
        }
    }
} );
