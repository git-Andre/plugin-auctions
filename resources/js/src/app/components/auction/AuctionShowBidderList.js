// const NotificationService = require( "services/NotificationService" );

Vue.component( "auction-show-bidderlist", {

    props: [
        "template"
    ],

    data() {
        return {
            test: "test"
        };
    },

    created() {
        this.$options.template = this.template;
    },

    ready() {
        // this.changeTooltipText();
    },

    methods:
        {
            showBidderList() {
                alert( 'showList: ' );
            },
        }
} );
