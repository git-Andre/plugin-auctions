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
         * @param ApiRouter $apiRouter
         */
        public function map(Router $router, ApiRouter $apiRouter)
        {
            $apiRouter -> version(['v1'], ['namespace' => 'PluginAuctions\Controllers', 'middleware' => 'oauth'],
                function ($apiRouter) {

//                    $apiRouter -> get('auctions/', 'AuctionsController@getAuctions');
                    $apiRouter -> delete('auctions/auction/{id}', 'AuctionsController@deleteAuction');
                });

            // new + API

            $router -> get('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@getAuction')
                    -> where('id', '\d+');

            $router -> get('api/auctions', 'PluginAuctions\Controllers\AuctionsController@getAuctions');


            // old
            $router -> get('api/auctionitemid/{itemId}', 'PluginAuctions\Controllers\AuctionsController@getAuctionForItemId')
                    -> where('itemId', '\d+');


            $router -> post('api/auction-param-list', 'PluginAuctions\Controllers\AuctionsController@getAuctionParamsListForCategoryItem');


            $router -> get('api/bidderlist/{id}', 'PluginAuctions\Controllers\AuctionsController@getBidderList') -> where('id', '\d+');

            $router -> get('api/auctionbidprice/{id}', 'PluginAuctions\Controllers\AuctionsController@getCurrentBidPrice')
                    -> where('id', '\d+');

            $router -> get('api/auction_last_entry/{id}', 'PluginAuctions\Controllers\AuctionsController@getBidderListLastEntry')
                    -> where('id', '\d+');


            $router -> post('api/auction', 'PluginAuctions\Controllers\AuctionsController@createAuction');

            $router -> put('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@updateAuction') -> where('id', '\d+');

            $router -> put('api/bidderlist/{id}', 'PluginAuctions\Controllers\AuctionsController@updateBidderlist')
                    -> where('id', '\d+');

//            $router -> delete('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@deleteAuction') -> where('id', '\d+');

            // helper
            $router -> get('api/date/{time}', 'PluginAuctions\Controllers\AuctionsController@formatDate')
                    -> where('time', '\d+');
            $router -> get('api/calctime/{start}/{end}', 'PluginAuctions\Controllers\AuctionsController@calculateTense');


            // Order...
            $router -> get('api/getorder/{orderId}', 'PluginAuctions\Controllers\AuctionPlaceOrderController@getOrderById')
                    -> where('orderId', '\d+');

            $router -> get('api/placeorder/{auctionId}', 'PluginAuctions\Controllers\AuctionPlaceOrderController@triggerPlaceOrder')
                    -> where('auctionId', '\d+');
            $router -> put('api/set-tense/{auctionId}', 'PluginAuctions\Controllers\AuctionsController@updateAuctionWithTense')
                    -> where('auctionId', '\d+');

            // test
            $router -> get('api/testitem/{itemId}', 'PluginAuctions\Controllers\AuctionHelperController@testItemService')
                    -> where('itemId', '\d+');
            $router -> get('api/testcustomer/{customerId}', 'PluginAuctions\Controllers\AuctionHelperController@testCustomerService')
                    -> where('customerId', '\d+');
            $router -> get('api/testcustomeraddresses/{customerId}/{typeId}/{last}', 'PluginAuctions\Controllers\AuctionHelperController@testCustomerAddresses')
                    -> where('customerId', '\d+');
            $router -> get('api/testparamsbuilder/{auctionId}', 'PluginAuctions\Controllers\AuctionHelperController@auctionParamsBuilder')
                    -> where('auctionId', '\d+');
            $router -> get('api/test-tense', 'PluginAuctions\Controllers\AuctionsController@getAuctionsForTense');

            $router -> get('api/test-past-auctions', 'PluginAuctions\Controllers\AuctionsController@getAuctionsInPast');

            $router -> get('api/test-handle-cron', 'PluginAuctions\Controllers\CronTest@cronTest');

            $router -> post('api/auctions-itemids-tense', 'PluginAuctions\Controllers\AuctionsController@getAuctionForItemIdAndTense');

//            $router -> get('api/auctionshelper', 'PluginAuctions\Controllers\AuctionsController@getAuctionsHelper');

            // Visitors...
            $router -> get('api/get-number-visitors/{itemId}', 'PluginAuctions\Controllers\VisitorCounterController@getNumberOfVisitorsForItemId')
                    -> where('itemId', '\d+');

            $router -> get('api/get-visitor-counters', 'PluginAuctions\Controllers\VisitorCounterController@getVisitorCounters');

//            $router -> post('api/create-visitor-counter', 'PluginAuctions\Controllers\VisitorCounterController@createVisitorCounter');

            $router -> put('api/increase-number-visitors', 'PluginAuctions\Controllers\VisitorCounterController@increaseNumberOfVisitorsForItemId');

            $router -> delete('api/delete-visitor-counter/{id}', 'PluginAuctions\Controllers\VisitorCounterController@deleteVisitorCounter')
                    -> where('id', '\d+');


            // auctionend - add to basket
            $router -> post('auction_to_basket', 'PluginAuctions\Controllers\AuctionToBasketController@add');

        }
    }