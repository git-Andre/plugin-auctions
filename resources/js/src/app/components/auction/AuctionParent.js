const ApiService      = require( "services/ApiService" );
const ResourceService = require( "services/ResourceService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

// const MINI_CRYPT  = 46987;
// const NOTIFY_TIME = 10000;

Vue.component( "auction-parent", {
    props: [
        "template",
        "auctiondata"
    ],
    data() {
        return {
            auction: {},
            bidderList: []
        }
    },
    created() {
        this.$options.template = this.template;
        // this.auctionid         = parseInt( this.auctionid );

        // this.auction   = this.auctionFromServer;
        // this.auction           = this.getAuction();
        // this.deadline = this.auction.expiryDate;
        // console.log( 'this.deadline: ' + this.deadline );
    },
    compiled() {
        this.bidderList = this.auctiondata.bidderList;

        this.auction.id              = parseInt( this.auctiondata.id );
        this.auction.startDate       = parseInt( this.auctiondata.startDate );
        this.auction.auctionDuration = parseInt( this.auctiondata.auctionDuration );
        this.auction.expiryDate      = parseInt( this.auctiondata.expiryDate );

        this.auction.startPrice = this.toFloatTwoDecimal( this.auctiondata.startPrice );

        this.auction.tense = this.auctiondata.tense;
    },
    ready() {
        console.log( 'auction-parent this:' );
        console.dir(this);
    },
    methods: {
        getAuction() {
            ApiService.get( "/api/auction/" + this.auction.id )
                .done( auction => {

                    this.auction = auction;
                } )
                .fail( () => {
                           alert( 'Upps - ein Fehler bei biddersFromServer ??!!' );
                       }
                )
        },
        toFloatTwoDecimal(value) {
            return Math.round( parseFloat( value ) * 100 ) / 100.0
        }

    }
} )