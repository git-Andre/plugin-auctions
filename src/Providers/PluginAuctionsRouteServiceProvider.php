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
         * @param ApiRouter $api
         */

//    $api->version(['v1'], ['namespace' => 'IO\Api\Resources'], function ($api)
//        $api->get('io/basket', 'BasketResource@index');

//        public function map(Router $router)
        public function map(Router $router, ApiRouter $api)
        {
//            $api -> version(['v1'], ['namespace' => 'PluginAuctions\Controllers'], // 'middleware' => ['oauth']
//                function ($api) {
//                    $api -> delete('api/auction/{id}',
//                        ['uses' => 'AuctionsController@deleteAuction']);
//                });


            $router -> get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
            $router -> get('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@getAuction') -> where('id', '\d+');
            $router -> post('api/auction', 'PluginAuctions\Controllers\PluginAuctionsController@createAuction');
            $router -> put('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@updateAuction') -> where('id', '\d+');
            $router -> delete('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@deleteAuction') -> where('id', '\d+');


            /** @var ApiRouter $routerApi TestEbaySdkRouteServiceProvider. */
//            $api -> version(['v1'], ['middleware' => ['oauth']], function ($router) {
//                $router->get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
//            });
        }

    }