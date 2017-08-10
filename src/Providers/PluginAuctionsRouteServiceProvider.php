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
//        public function map(Router $router)
        public function map(Router $router, ApiRouter $api)
        {
            $router->get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
            $router -> get('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@getAuction') -> where('id', '\d+');
            $router -> post('api/auction', 'PluginAuctions\Controllers\PluginAuctionsController@createAuction');
            $router -> put('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@updateAuction') -> where('id', '\d+');
            $router -> delete('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@deleteAuction') -> where('id', '\d+');

//            $api -> version(['v1'], ['middleware' => 'oauth'],
//                function ($api) {
//                    $api -> get('api/auctions/', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
//                });

            /** @var ApiRouter $routerApi TestEbaySdkRouteServiceProvider. */
//            $api -> version(['v1'], ['middleware' => ['oauth']], function ($router) {
//                $router->get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
//            });
        }

    }