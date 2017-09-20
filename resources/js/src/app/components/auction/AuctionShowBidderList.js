Vue.component( "auction-show-bidderlist", {

    props: {
        "template": String,
        "auction": {},
    },

    data() {
        return {
            bidderList: [],
            bidders: 0
        };
    },

    created() {
        this.$options.template = this.template;

        this.auction = JSON.parse( this.auction );

        const bidderData     = this.auction.bidderList;
        var differentBidders = [0];

        this.bidderList = [];
        for (var i = bidderData.length; --i >= 0;) {
            var bidView = {};

            bidView.bidderName   = bidderData[i].bidderName;
            bidView.bidPrice     = bidderData[i].bidPrice;
            bidView.bidTimeStamp = bidderData[i].bidTimeStamp * 1000;

            this.bidderList.push( bidView );

            const currentUserId = bidderData[i].customerId;

            if ( differentBidders.indexOf( currentUserId ) < 0 ) {
                differentBidders.push( currentUserId );
            }
        }
        this.bidders = differentBidders.length - 1;
    },
} )
;
