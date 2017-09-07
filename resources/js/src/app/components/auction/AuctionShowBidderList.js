const NotificationService = require( "services/NotificationService" );
const ResourceService     = require( "services/ResourceService" );

Vue.component( "auction-show-bidderlist", {

    props: [
        "template",
        "bidderdata"
    ],

    data() {
        return {
            bidderList: [{}]
        };
    },

    created() {
        this.$options.template = this.template;

        console.dir( this.bidderdata );

        this.bidderdata = JSON.parse(this.bidderdata );
        this.bidderList = [];
        var bid         = {};
        var bidView     = {"bidderName": "Name", "bidPrice": 1.1, "bidTime": 152};

        for (bid in this.bidderdata) {
            console.dir(bid);

            bidView = bidView["bidderName"] = bid.bidderName;
            bidView = bidView["bidPrice"] = bid["bidPrice"];
            bidView = bidView["bidTime"] = bid.bidTime;

            this.bidderList.push(bidView);
        }

        // this.bidderdata = {}
    },

    ready() {
        // this.changeTooltipText();
    },

    methods:
        {
            showBidderList() {
                alert( 'show Bidder List...' );

                // if ( this.item.filter.isSalable ) {
                //     const basketObject =
                //               {
                //                   variationId: this.variationId,
                //                   quantity: this.quantity,
                //                   basketItemOrderParams: this.item.properties
                //               };
                //
                //     ResourceService.getResource( "basketItems" ).push( basketObject )
                //         .done( function () {
                //             this.openAddToBasketOverlay();
                //         }
                //                    .bind( this ) )
                //         .fail( function (response) {
                //             NotificationService.error(
                //                 Translations.Template[ExceptionMap.get( response.data.exceptionCode.toString() )] )
                //                 .closeAfter( 5000 );
                //         } );
                // }

            },
        }
} );
