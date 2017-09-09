var ApiService            = require( "services/ApiService" );
const NotificationService = require( "services/NotificationService" );

module.exports = (function ($) {

    var bidderListLastEntry;
    var getPromise;

    return {
        getBidderList: getBidderList,
        getExpiryDate: getExpiryDate
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
                                                       auction.bidderList[0].bidTimeStamp = auction.startDate;

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

    function getExpiryDate(auctionId) {
        return new Promise( (resolve, reject) => {
                                if ( auctionId ) {

                                    ApiService.get( "/api/auction/" + auctionId )
                                        .then( auction => {
                                                   resolve( auction.expiryDate);
                                               },
                                               error => {
                                                   reject( error );
                                               }
                                        )
                                }
                                else {
                                    alert( 'Fehler in id (Date):: ' + auctionId );
                                }
                            }
        )
    }
})
( jQuery );
