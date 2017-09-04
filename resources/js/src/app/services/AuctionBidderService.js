var ApiService = require( "services/ApiService" );

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
                                        .done( function (response) {
                                            // alert( 'response.bidderList[response.bidderList.length - 1]: ' + response.bidderList[response.bidderList.length - 1] );

                                            resolve();
                                        } )
                                        .fail( () => {
                                            reject();
                                        } );
                                }
                                else {
                                    resolve();
                                }
                            }
        )
    }

// function getBidderListLastEntry(auctionId) {
//     alert('getPromise: ' + getPromise);
//     if ( !getPromise ) {
//         alert( "1" + bidderListLastEntry.bidPrice )
//         if ( auctionId ) {
//             getPromise = $.Deferred();
//             alert( "2" + bidderListLastEntry.customerId )
//
//             getPromise.resolve();
//         }
//         else {
//             alert('getPromise2: ' + getPromise);
//
//             getPromise = ApiService.get( "/api/auction/" + auctionid )
//                 .done( function (response) {
//                     bidderListLastEntry = response.bidderList[response.bidderList.length - 1];
//                 } );
//         }
//     }
//     return getPromise;
// }
})
( jQuery );
