var ApiService            = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );

module.exports = (function ($) {

    var bidderListLastEntry;
    var getPromise;

    return {
        getBidderList: getBidderList,
    };

    function getBidderList(auctionId, lastEntry = false) {
        return new Promise( (resolve, reject) => {
                                if ( auctionId ) {
                                    ApiService.get( "/api/auction/" + auctionId )
                                        .then( auction => {
                                                   NotificationService.error( "TEST" ).closeAfter( 3000 );
                                                   // setTimeout( () =>
                                                   //     resolve( auction.bidderList[auction.bidderList.length - 1] ), 1000 );
                                                   if ( lastEntry ) {
                                                       resolve( auction.bidderList[auction.bidderList.length - 1] );
                                                   }
                                                   else {
                                                       auction.bidderList[0].bidPrice = auction.currentPrice;

                                                       resolve( auction.bidderList );
                                                   }
                                               },
                                               error => {
                                                   reject( error );
                                               }
                                        )
                                }
                                else {
                                    alert( 'Fehler in id:: ' + auctionId );
                                }
                            }
        )
    }
})
( jQuery );
