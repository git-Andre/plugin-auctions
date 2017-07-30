<?php

    namespace PluginAuctions\Providers;

    use Plenty\Plugin\RouteServiceProvider;
    use Plenty\Plugin\Routing\ApiRouter;
    use Plenty\Plugin\Routing\Router;

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

                    $router -> get('api/auctions', 'PluginAuctionsController@showAuctions');
                    $router -> post('api/auction', 'PluginAuctionsController@createAuction');
                    $router -> put('api/auction/{id}', 'PluginAuctionsController@updateAuction') -> where('id', '\d+');
                    $router -> delete('api/auction/{id}', 'PluginAuctionsController@deleteAuction') -> where('id', '\d+');
                });


            $router -> get('hallo', 'PluginAuctions\Controllers\PluginAuctionsController@getHelloWorldPage');

        }
    }