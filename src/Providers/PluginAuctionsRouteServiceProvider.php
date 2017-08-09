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
            $router -> get('halt', 'PluginAuctions\Controllers\PluginAuctionsController@getHelloWorldPage');

//            $router->get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
            $router->get('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@getAuction')->where('id', '\d+');
            $router->post('api/auction', 'PluginAuctions\Controllers\PluginAuctionsController@createAuction');
            $router->put('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@updateAuction')->where('id', '\d+');
            $router->delete('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@deleteAuction')->where('id', '\d+');

            $api -> version([], ['namespace' => 'PluginAuctions\Controller', 'middleware' => 'oauth'],
                function ($routeApi) {
                    $routeApi -> get('api/auctions', ['uses' => 'PluginAuctionsController@getAuctions']);
                });

            /** @var ApiRouter $routerApi */
//                    $routerApi -> get('api/auctions', ['uses' => 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions']);
//                    $routerApi -> post('api/auction', ['uses' => 'PluginAuctions\Controllers\PluginAuctionsController@createAuction']);

//                    $routerApi -> get('api/auction/{id}', 'PluginAuctionsController@getAuction') -> where('id', '\d+');
//                    $routerApi -> put('api/auction/{id}', 'PluginAuctionsController@updateAuction') -> where('id', '\d+');
//                    $routerApi -> delete('api/auction/{id}', 'PluginAuctionsController@deleteAuction') -> where('id', '\d+');
//                });
//            $router -> get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
//
            $router -> get('hallo', 'PluginAuctions\Controllers\PluginAuctionsController@getHelloWorldPage');
//
        }
    }