const ApiService = require( "services/ApiService" );
// const NotificationService = require( "services/NotificationService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

Vue.component( "auction-parent", {
    props: [
        // "auction"
    ],
    data() {
        return {
        }
    },
    created() {
        this.$options.template = this.template;

    },
    compiled() {
    },
    ready() {
    },
    methods: {
        getTest() {
            ApiService.get( "/api/auction/" + this.auctionid )
                .done( auction => {
                    this.auction = auction;
                    this.$children['AuctionBids'].auction = this.auction;
                } )
                .fail( () => {
                           alert( 'Upps - ein Fehler bei biddersFromServer ??!!' );
                       }
                )
        }
    }
} )