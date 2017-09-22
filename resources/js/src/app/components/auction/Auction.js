// const ApiService          = require( "services/ApiService" );
// const NotificationService = require( "services/NotificationService" );
// const AuctionConstants    = require( "constants/AuctionConstants" );

// const MINI_CRYPT  = 46987;
// const NOTIFY_TIME = 10000;

Vue.component( "auction", {
    props: [
        "template",
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
    },
    watch: {
    }
} )
;
