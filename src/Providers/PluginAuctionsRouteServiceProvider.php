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
            $apiRouter -> version(['v1'], ['middleware' => ['oauth']],
                function ($routerApi) {

                    /** @var ApiRouter $routerApi*/
                    $routerApi -> get('api/auctions', ['uses' => 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions']);
                    $routerApi -> post('api/auction', ['uses' => 'PluginAuctions\Controllers\PluginAuctionsController@createAuction']);
//                    $routerApi -> get('api/auction/{id}', 'PluginAuctionsController@getAuction') -> where('id', '\d+');
//                    $routerApi -> put('api/auction/{id}', 'PluginAuctionsController@updateAuction') -> where('id', '\d+');
//                    $routerApi -> delete('api/auction/{id}', 'PluginAuctionsController@deleteAuction') -> where('id', '\d+');
                });

//            $router -> get('hallo', 'PluginAuctions\Controllers\PluginAuctionsController@getHelloWorldPage');

        }
    }