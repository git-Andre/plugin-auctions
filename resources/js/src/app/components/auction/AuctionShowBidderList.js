const NotificationService = require( "services/NotificationService" );
const ResourceService     = require( "services/ResourceService" );

Vue.component( "auction-show-bidderlist", {

    props: [
        "template",
        "bidderdata"
    ],

    data() {
        return {
            bidderList: [{ }]
        };
    },

    created() {
        this.$options.template = this.template;

        console.dir(this.bidderdata);


        //  var bid;
        // for (bid in this.bidderdata) {
        //
        // }
        // this.bidderList =
        //
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
