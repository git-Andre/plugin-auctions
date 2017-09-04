var ApiService = require( "services/ApiService" );
const NotificationService  = require( "services/NotificationService" );

module.exports = (function ($) {

    var bidderListLastEntry;
    var getPromise;

    return {
        getBidderListLastEntry: getBidderListLastEntry,
    };

    function getBidderListLastEntry(auctionId) {
        return new Promise( (resolve, reject) => {
                                if ( auctionId ) {
                                    ApiService.get( "/api/auction/" + auctionId )
                                        .then( response => {
                                                   NotificationService.error( "TEST" ).closeAfter( 3000 );
                                                   // setTimeout( () =>
                                                   //     resolve( response.bidderList[response.bidderList.length - 1] ), 1000 );
                                                   resolve( response.bidderList[response.bidderList.length - 1] );
                                               },
                                               error => {
                                                   reject( error );
                                               }
                                        )
                                }
                                else {
                                    alert( 'Fehler mit id:: ' + auctionId );
                                }
                            }
        )
    }
})
( jQuery );
