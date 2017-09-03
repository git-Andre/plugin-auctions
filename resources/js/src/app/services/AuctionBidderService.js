const ApiService      = require("services/ApiService");
// const CheckoutService = require("services/CheckoutService");

/**
 * Create a new address
 * @param address
 * @param addressType
 * @param setActive
 * @returns {*}
 */
// export function createAddress(address, addressType, setActive)
// {
//     return ApiService.post("/rest/io/customer/address?typeId=" + addressType, address, {supressNotifications: true})
//         .done(response =>
//         {
//             if (setActive)
//             {
//                 if (addressType === 1)
//                 {
//                     CheckoutService.setBillingAddressId(response.id);
//                 }
//                 else if (addressType === 2)
//                 {
//                     CheckoutService.setDeliveryAddressId(response.id);
//                 }
//             }
//         });
// }

/**
 * Update an existing auction
 * @param auctionId
 * @param newBid
 */
export function updateAuction(auctionId, newBid)
{
    return ApiService.put("/api/bidderlist/" + auctionId, newBid, {supressNotifications: true});
}


export default {updateAuction};

// initMinBidPrice() {
//     return new Promise( (resolve, reject) => {
//                             if ( this.auctionid ) {
//                                 // commit("getBidPrice", )
//                                 ApiService.get( "/api/auction/" + this.auctionid, {}, { supressNotifications: true } )
//                                     .done( auction => {
//                                         auction.bidderList[auction.bidderList.length - 1].bidPrice + 1;
//                                         resolve();
//                                     } )
//                                     .fail( () => {
//                                         alert( 'Schade - ein Fehler beim abholen' );
//                                         reject();
//                                     } );
//                             }
//                         }
//     )
// },
