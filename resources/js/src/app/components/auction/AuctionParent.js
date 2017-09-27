const ApiService      = require( "services/ApiService" );
const ResourceService = require( "services/ResourceService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

// const MINI_CRYPT  = 46987;
// const NOTIFY_TIME = 10000;

Vue.component( "auction-parent", {
    props: [
        "template",
        "data"
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
    },
    ready() {

        this.bidderList = this.data.bidderList;

        this.auction.id = this.toFloatTwoDecimal(this.data.id);
        this.auction.startDate = this.toFloatTwoDecimal(this.data.startDate);
        this.auction.auctionDuration = this.toFloatTwoDecimal(this.data.auctionDuration);
        this.auction.expiryDate = this.toFloatTwoDecimal(this.data.expiryDate);
        this.auction.startPrice = this.toFloatTwoDecimal(this.data.startPrice);

        this.auction.tense = this.data.tense;


        // this.auction = this.auction.remove("bidderList");

        // ResourceService.bind( "auction", this );
    },
    // events() {
    //     return {
    //         // 'auction-bids-test': function (maxCustomerBid) {
    //         //     this.test = maxCustomerBid
    //         }
    //     }
    // },
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