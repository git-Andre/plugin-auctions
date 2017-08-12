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
            $api -> version('v1', // ['namespace' => 'PluginAuctions\Controllers', 'middelware' => 'outh'],
                function ($api) {
//                    $api -> get('api/auctions', ['uses' => '\AuctionsController@getAuctions']);
//                    $api -> get('api/auction/{id}', ['uses' => '\AuctionsController@getAuction']);
//                    $api -> post('api/auction', ['uses' => '\AuctionsController@createAuction']);
//                    $api -> put('api/auction/{id}', ['uses' => '\AuctionsController@updateAuction']);
                    $api -> delete('api/auction/{id}', 'AuctionsController@deleteAuction');
                });


            $router -> get('api/auctions', 'PluginAuctions\Controllers\AuctionsController@getAuctions');
            $router -> get('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@getAuction') -> where('id', '\d+');
            $router -> post('api/auction', 'PluginAuctions\Controllers\AuctionsController@createAuction');
            $router -> put('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@updateAuction') -> where('id', '\d+');
//            $router -> delete('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@deleteAuction') -> where('id', '\d+');


        }

    }