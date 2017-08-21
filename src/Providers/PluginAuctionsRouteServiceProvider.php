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
//            $api -> version(['v1'], ['middelware' => 'outh'],
//                function ($api) {
////                    $api -> get('api/auctions', ['uses' => '\AuctionsController@getAuctions']);
////                    $api -> get('api/auction/{id}', ['uses' => '\AuctionsController@getAuction']);
////                    $api -> post('api/auction', ['uses' => '\AuctionsController@createAuction']);
////                    $api -> put('api/auction/{id}', ['uses' => '\AuctionsController@updateAuction']);
//                    $api -> delete('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@deleteAuction');
//                });

            $router -> get('api/auctionitemid/{itemId}', 'PluginAuctions\Controllers\AuctionsController@getAuctionForItemId') -> where('itemId', '\d+');

            $router -> get('api/auctions', 'PluginAuctions\Controllers\AuctionsController@getAuctions');
            $router -> get('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@getAuction') -> where('id', '\d+');
            $router -> post('api/auction', 'PluginAuctions\Controllers\AuctionsController@createAuction');
            $router -> put('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@updateAuction') -> where('id', '\d+');
            $router -> delete('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@deleteAuction') -> where('id', '\d+');


//            $router -> get('api/liveauctions', 'PluginAuctions\Controllers\AuctionsController@getLiveAuctions');
//
//            $router -> get('api/liveauctionitemid/{itemId}', 'PluginAuctions\Controllers\AuctionsController@getLiveAuctionForItemId') -> where('itemId', '\d+');
//
//            $router -> get('api/liveauction/{id}', 'PluginAuctions\Controllers\AuctionsController@getLiveAuction') -> where('id', '\d+');
//            $router -> post('api/liveauction', 'PluginAuctions\Controllers\AuctionsController@createLiveAuction');
//            $router -> put('api/liveauction/{id}', 'PluginAuctions\Controllers\AuctionsController@updateLiveAuction') -> where('id', '\d+');
//            $router -> delete('api/liveauction/{id}', 'PluginAuctions\Controllers\AuctionsController@deleteLiveAuction') -> where('id', '\d+');

            $router -> get('api/test/{time}', 'PluginAuctions\Controllers\AuctionsController@formatDate') -> where('time', '\d+');

        }
    }