const ApiService      = require( "services/ApiService" );
const ResourceService = require( "services/ResourceService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

// const MINI_CRYPT  = 46987;
// const NOTIFY_TIME = 10000;

Vue.component( "auction-parent", {
    props: [
        "template",
        "auctionid",
        // "deadline",
        // "auction"
    ],
    // el() {
    //     return  '#addAuctionVue'
    // },
    data() {
        return {
            auction: {}
            // deadline: Number
        }
    },
    created() {
        this.$options.template = this.template;
        this.auctionid         = parseInt( this.auctionid );
        this.auction           = this.getAuction();
        console.dir(this.auction);
        this.auction    =  JSON.parse( this.auction );
        console.log( 'nach Parse' );
        console.dir(this.auction);
        // this.deadline = this.auction.expiryDate;
        // console.log( 'this.deadline: ' + this.deadline );
    },
    compiled() {
    },
    ready() {
        // ResourceService.bind( "auction", this );
        setTimeout( () => {
            console.dir( this.auction );
        }, 3000 );

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
                    // this.$children['AuctionBids'].auction = this.auction;
                } )
                .fail( () => {
                           alert( 'Upps - ein Fehler bei biddersFromServer ??!!' );
                       }
                )
        }
    }
} )