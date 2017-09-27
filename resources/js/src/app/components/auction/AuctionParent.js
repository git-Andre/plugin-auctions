const ApiService      = require( "services/ApiService" );
const ResourceService = require( "services/ResourceService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

// const MINI_CRYPT  = 46987;
// const NOTIFY_TIME = 10000;

Vue.component( "auction-parent", {
    props: [
        "template",
        // "auctionFromServer"
        "data"
    ],
    // el() {
    //     return  '#addAuctionVue'
    // },
    data() {
        return {
            auction: {},
            bidderList: []
            // deadline: Number
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
        this.auction = this.data;
        this.bidderList = this.auction.bidderList;

        // this.auction = this.auction.remove("bidderList");

        console.dir(this.auction);
        console.dir(this.bidderList);
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
            ApiService.get( "/api/auction/" + this.auctionid )
                .done( auction => {

                    this.auction = auction;
                } )
                .fail( () => {
                           alert( 'Upps - ein Fehler bei biddersFromServer ??!!' );
                       }
                )
        }
    }
} )