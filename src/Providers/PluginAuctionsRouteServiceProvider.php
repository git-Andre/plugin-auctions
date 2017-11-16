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

                    $apiRouter -> delete('auctions/delete/{id}', 'AuctionsController@deleteAuction');

                    $apiRouter -> post('auctions/create', 'AuctionsController@createAuction');

                    $apiRouter -> put('auctions/update/{id}', 'AuctionsController@updateAuction') -> where('id', '\d+');

                    // Visitors...
                    $apiRouter -> put('auctions/increase-number-visitors', 'VisitorCounterController@increaseNumberOfVisitorsForItemId');

                    $apiRouter -> delete('auctions/delete-visitor-counter/{id}', 'VisitorCounterController@deleteVisitorCounter') -> where('id', '\d+');


                });

            // new - Routes for all...
            $router -> get('auctions/all', 'PluginAuctions\Controllers\AuctionsController@getAuctions');

            $router -> get('auctions/{id}', 'PluginAuctions\Controllers\AuctionsController@getAuction') -> where('id', '\d+');

            $router -> get('auctions/forItemId/{itemId}', 'PluginAuctions\Controllers\AuctionsController@getAuctionForItemId') -> where('itemId', '\d+');

            $router -> get('auctions/calctime/{start}/{end}', 'PluginAuctions\Controllers\AuctionsController@calculateTense');

            $router -> get('auctions/lastbidprice/{id}', 'PluginAuctions\Controllers\AuctionsController@getCurrentBidPrice') -> where('id', '\d+');

            $router -> put('auctions/bidderlist/{id}', 'PluginAuctions\Controllers\AuctionsController@updateBidderlist') -> where('id', '\d+');

            $router -> post('auctions/paramlist', 'PluginAuctions\Controllers\AuctionsController@getAuctionParamsListForCategoryItem');


            $router -> get('auctions/lastentry/{id}', 'PluginAuctions\Controllers\AuctionsController@getBidderListLastEntry') -> where('id', '\d+');

            $router -> get('auctions/bidderlist/{id}', 'PluginAuctions\Controllers\AuctionsController@getBidderList') -> where('id', '\d+');

            // Visitors...
            $router -> get('auctions/get-number-visitors/{itemId}', 'PluginAuctions\Controllers\VisitorCounterController@getNumberOfVisitorsForItemId') -> where('itemId', '\d+');

            $router -> get('auctions/get-visitor-counters', 'PluginAuctions\Controllers\VisitorCounterController@getVisitorCounters');

            //  in Arbeit

            // old #########################################
//            $router -> post('auction/create', 'PluginAuctions\Controllers\AuctionsController@createAuction');

//            $router -> delete('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@deleteAuction') -> where('id', '\d+');

            // helper
            $router -> get('api/date/{time}', 'PluginAuctions\Controllers\AuctionsController@formatDate')
                    -> where('time', '\d+');


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


//            $router -> post('auctions/create-visitor-counter', 'PluginAuctions\Controllers\VisitorCounterController@createVisitorCounter');


            // auctionend - add to basket
//            $router -> post('auction_to_basket', 'PluginAuctions\Controllers\AuctionToBasketController@add');

        }
    }