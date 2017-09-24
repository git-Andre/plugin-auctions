// const ApiService          = require( "services/ApiService" );
// const NotificationService = require( "services/NotificationService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

// const MINI_CRYPT  = 46987;
// const NOTIFY_TIME = 10000;

Vue.component( "auction-parent", {
    props: [
        // "template",
        // "auction"
    ],
    el: 'addAuctionVue',
    data() {
        return {
            test: ""
        }
    },
    created() {
        // this.$options.template = this.template;
        // this.auction = JSON.parse(this.auction);
    },
    compiled() {
    },
    ready() {
    },
    events: {
        'auction-bids-test' function(test) {
            this.test = test
        }
    },
    methods: {},
    watch: {}
} );
