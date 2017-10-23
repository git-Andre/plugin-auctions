// const ApiService = require( "services/ApiService" );
// const NotificationService = require( "services/NotificationService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

Vue.component( "visitor-counter", {
    props: [
        numberOfVisitors
    ],
    data() {
        return {
            oneS      = 0,
            tens      = 0,
            hundreds      = 0,
            thousands      = 0
        }
    },
    created() {
        this.$options.template = this.template;
    },
    compiled() {

        console.log( 'numberOfVisitors: ' + this.numberOfVisitors );
    },
    ready() {
        this.oneS      = this.numberOfVisitors % 10;
        this.tens      = (this.numberOfVisitors / 10 - oneS) % 10;
        this.hundreds  = (this.numberOfVisitors / 10 - tens) % 10;
        this.thousands = (this.numberOfVisitors / 10 - hundreds) % 10;
    },
    methods: {
        // twoDigits(value) {
        //     if ( value.toString().length <= 1 ) {
        //         return '0' + value.toString()
        //     }
        //     return value.toString()
        // }

        // getTest() {
        //     ApiService.get( "/api/auction/" + this.auctionid )
        //         .done( auction => {
        //             this.auction = auction;
        //             this.$children['AuctionBids'].auction = this.auction;
        //         } )
        //         .fail( () => {
        //                    alert( 'Upps - ein Fehler bei biddersFromServer ??!!' );
        //                }
        //         )
        // }
    }
} )