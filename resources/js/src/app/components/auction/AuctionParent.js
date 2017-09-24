const ApiService = require( "services/ApiService" );
// const NotificationService = require( "services/NotificationService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

// const MINI_CRYPT  = 46987;
// const NOTIFY_TIME = 10000;

Vue.component( "auction-parent", {
    props: [
        "template",
        "auctionid"
    ],
    // el() {
    //     return  '#addAuctionVue'
    // },
    data() {
        return {
            auction: {}
            // test: ""
        }
    },
    created() {
        this.$options.template = this.template;
        this.auctionid         = parseInt( this.auctionid );
        console.log( 'this.auctionid: ' + this.auctionid );
        this.auction           = this.getAuction( this.auctionid );
        console.log( 'this.auction: ' + this.auction );
            },
    compiled() {
    },
    ready() {
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
                    this.auction = auction ;
                } )
                .fail( () => {
                           alert( 'Upps - ein Fehler bei biddersFromServer ??!!' );
                       }
                )
        }
    }
} )