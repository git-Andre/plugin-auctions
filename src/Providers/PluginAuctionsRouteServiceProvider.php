<?php

    namespace PluginAuctions\Providers;

    use Plenty\Plugin\RouteServiceProvider;
    use Plenty\Plugin\Routing\Router;
    use Plenty\Plugin\Routing\ApiRouter;



    /**
     * Class PluginAuctionsRouteServiceProvider
     * @package PluginAuctions\Providers
     */
    class PluginAuctionsRouteServiceProvider extends RouteServiceProvider {

        /**
         * @param Router $router
         */
        public function map(Router $router, ApiRouter $apiRouter)
        {
            $apiRouter -> version(['v1'], ['namespace' => 'PluginAuctions\Controllers', 'middleware' => 'oauth'],
                function ($apiRouter) {

                    $apiRouter -> get('api/auctions', 'PluginAuctionsController@showAuctions');
                    $apiRouter -> post('api/auction', 'PluginAuctionsController@createAuction');
                    $apiRouter -> put('api/auction/{id}', 'PluginAuctionsController@updateAuction') -> where('id', '\d+');
                    $apiRouter -> delete('api/auction/{id}', 'PluginAuctionsController@deleteAuction') -> where('id', '\d+');
                });


            $router -> get('hallo', 'PluginAuctions\Controllers\PluginAuctionsController@getHelloWorldPage');

        }
    }