<?php

    namespace PluginAuctions\Providers;

    use Plenty\Plugin\RouteServiceProvider;
    use Plenty\Plugin\Routing\ApiRouter;
    use Plenty\Plugin\Routing\Router;


    /**
     * Class PluginAuctionsRouteServiceProvider
     */
    class PluginAuctionsRouteServiceProvider extends RouteServiceProvider {

        /**
         * @param Router $router
         * @param ApiRouter $api
         */

        public function map(Router $router, ApiRouter $api)
        {
//            $api -> version(['v1'], ['namespace' => 'PluginAuctions\Api\Resources', 'middelware' => 'oauth'],
            $api -> version(['v1'], ['namespace' => 'PluginAuctions\Controllers'],
                function ($api) {

                    //                $api -> get('api/auctionshelper', 'AuctionsController@getAuctionsHelper');

//                    $api -> get('api/auction/{id}', 'AuctionsController@getAuction') -> where('id', '\d+');

                    // Order...
//                    $api -> post('api/auction', 'AuctionsController@createAuction');

                    $api -> post('api/placeorder', 'AuctionPlaceOrderController@store');

                    $api -> get('api/placeorder', 'AuctionPlaceOrderController@index');


                    //                    $api -> get('api/auctions', ['uses' => '\AuctionsController@getAuctions']);
                    //                    $api -> post('api/auction', ['uses' => '\AuctionsController@createAuction']);
                    //                    $api -> put('api/auction/{id}', ['uses' => '\AuctionsController@updateAuction']);
                    //                    $api -> delete('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@deleteAuction');
                });

            $router -> get('api/auctionitemid/{itemId}', 'PluginAuctions\Controllers\AuctionsController@getAuctionForItemId')
                    -> where('itemId', '\d+');

            $router -> get('api/auctions', 'PluginAuctions\Controllers\AuctionsController@getAuctions');
            $router -> get('api/auctionshelper', 'PluginAuctions\Controllers\AuctionsController@getAuctionsHelper');

            $router -> get('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@getAuction')
                    -> where('id', '\d+');

            $router -> get('api/bidderlist/{id}', 'PluginAuctions\Controllers\AuctionsController@getBidderList')
                    -> where('id', '\d+');

            $router -> get('api/auctionbidprice/{id}', 'PluginAuctions\Controllers\AuctionsController@getCurrentBidPrice')
                    -> where('id', '\d+');


            $router -> post('api/auction', 'PluginAuctions\Controllers\AuctionsController@createAuction');

            $router -> put('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@updateAuction')
                    -> where('id', '\d+');

            $router -> put('api/bidderlist/{id}', 'PluginAuctions\Controllers\AuctionsController@updateBidderlist')
                    -> where('id', '\d+');

            $router -> delete('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@deleteAuction')
                    -> where('id', '\d+');

            $router -> get('api/date/{time}', 'PluginAuctions\Controllers\AuctionsController@formatDate')
                    -> where('time', '\d+');
            $router -> get('api/calctime/{start}/{end}', 'PluginAuctions\Controllers\AuctionsController@calculateTense');


            // Order...
            $router -> get('api/getorder/{orderId}', 'PluginAuctions\Controllers\AuctionPlaceOrderController@getOrderById')
                    -> where('orderId', '\d+');

//            $router -> get('api/placeorder/{auctionId}', 'PluginAuctions\Controllers\AuctionPlaceOrderController@triggerPlaceOrder')
//                    -> where('auctionId', '\d+');
//
            // tests
            $router -> get('api/testitem/{itemId}', 'PluginAuctions\Controllers\AuctionHelperController@testItemService')
                    -> where('itemId', '\d+');
            $router -> get('api/testcustomer/{customerId}', 'PluginAuctions\Controllers\AuctionHelperController@testCustomerService')
                    -> where('customerId', '\d+');
            $router -> get('api/testcustomeraddresses/{customerId}/{typeId}/{last}', 'PluginAuctions\Controllers\AuctionHelperController@testCustomerAddresses')
                    -> where('customerId', '\d+');
            $router -> get('api/testparamsbuilder/{auctionId}', 'PluginAuctions\Controllers\AuctionHelperController@auctionParamsBuilder')
                    -> where('auctionId', '\d+');
        }
    }