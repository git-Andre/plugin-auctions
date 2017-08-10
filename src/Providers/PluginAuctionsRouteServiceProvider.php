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
//        public function map(Router $router)
        public function map(Router $router, ApiRouter $api)
        {
            $api -> version([''], ['middleware' => ['oauth']],
                function ($api) {
                    $api -> delete('api/auction/{id}',
                            ['uses' => 'PluginAuctions\Controllers\PluginAuctionsController@deleteAuction']);
                });


            $router->get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
            $router -> get('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@getAuction') -> where('id', '\d+');
            $router -> post('api/auction', 'PluginAuctions\Controllers\PluginAuctionsController@createAuction');
            $router -> put('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@updateAuction') -> where('id', '\d+');
//            $router -> delete('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@deleteAuction') -> where('id', '\d+');


            /** @var ApiRouter $routerApi TestEbaySdkRouteServiceProvider. */
//            $api -> version(['v1'], ['middleware' => ['oauth']], function ($router) {
//                $router->get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@getAuctions');
//            });
        }

    }