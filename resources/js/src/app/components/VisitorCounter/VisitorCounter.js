// const ApiService = require( "services/ApiService" );
// const NotificationService = require( "services/NotificationService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

Vue.component("visitor-counter", {
    props: [
        "template",
        "numberOfVisitors"
    ],
    data()
{
        return {
            ones: 0,
            tens: 0,
            hundreds: 0,
            thousands: 0
        };
    },
    created()
{
        this.$options.template = this.template;
    },
    compiled()
{
        this.numberOfVisitors = parseInt(this.numberOfVisitors);
    },
    ready()
{

        this.ones = this.numberOfVisitors % 10;
        this.tens = (parseInt(this.numberOfVisitors / 10)) % 10;
        this.hundreds = (parseInt(this.numberOfVisitors / 10 / 10)) % 10;
        this.thousands = (parseInt(this.numberOfVisitors / 10 / 10 / 10)) % 10;
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
});
