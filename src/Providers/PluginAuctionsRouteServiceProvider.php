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
            $api -> version([''], ['namespace' => 'PluginAuctions\Controllers', 'middelware' => 'outh'], // 'middleware' => ['oauth']
                function ($api) {
                    $api -> delete('api/auction/{id}', ['uses' => 'AuctionsController@deleteAuction']);
                    $api -> get('api/auctions', ['uses' => '\AuctionsController@getAuctions']);
                });


//            $router -> get('api/auctions', 'PluginAuctions\Controllers\AuctionsController@getAuctions');
            $router -> get('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@getAuction') -> where('id', '\d+');
            $router -> post('api/auction', 'PluginAuctions\Controllers\AuctionsController@createAuction');
            $router -> put('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@updateAuction') -> where('id', '\d+');
//            $router -> delete('api/auction/{id}', 'PluginAuctions\Controllers\AuctionsController@deleteAuction') -> where('id', '\d+');


            /** @var ApiRouter $routerApi TestEbaySdkRouteServiceProvider. */
//            $api -> version(['v1'], ['middleware' => ['oauth']], function ($router) {
//                $router->get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
//            });
        }

    }