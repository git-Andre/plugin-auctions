const NotificationService = require( "services/NotificationService" );
const ResourceService     = require( "services/ResourceService" );

Vue.component( "auction-show-bidderlist", {

    props: [
        "template",
        "bidderdata"
    ],

    data() {
        return {
            bidderList: []
        };
    },

    created() {
        this.$options.template = this.template;


        this.bidderdata = JSON.parse( this.bidderdata );
        this.bidderList = [];

        for (var i = this.bidderdata.length; --i >= 0;) {
            var bidView     = { };

            bidView.bidderName = this.bidderdata[i].bidderName;
            bidView.bidPrice = this.bidderdata[i].bidPrice;
            bidView.bidTimeStamp = this.bidderdata[i].bidTimeStamp;

            this.bidderList.push( bidView );
        }
        this.bidderdata = [];
    },

    ready() {

    },

    methods:
        {
        }
} );
