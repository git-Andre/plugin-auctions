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
                                        .then( response => {
                                                   NotificationService.error( "TEST" ).closeAfter( 3000 );
                                                   // setTimeout( () =>
                                                   //     resolve( response.bidderList[response.bidderList.length - 1] ), 1000 );
                                                   if ( lastEntry ) {
                                                       resolve( response.bidderList[response.bidderList.length - 1] );
                                                   }
                                                   else {
                                                       resolve( response.bidderList );
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
