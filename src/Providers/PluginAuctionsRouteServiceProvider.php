<?php

namespace PluginAuctions\Providers;

use Plenty\Plugin\RouteServiceProvider;
use Plenty\Plugin\Routing\Router;

/**
 * Class PluginAuctionsRouteServiceProvider
 * @package PluginAuctions\Providers
 */
class PluginAuctionsRouteServiceProvider extends RouteServiceProvider
{
    /**
     * @param Router $router
     */
    public function map(Router $router)
    {
        $router->get('hallo','PluginAuctions\Controllers\PluginAuctionsController@getHelloWorldPage');

        $router->get('api/auctions', 'PluginAuctions\Controllers\PluginAuctionsController@showAuctions');
        $router->post('api/auction', 'PluginAuctions\Controllers\PluginAuctionsController@createAuction');
        $router->put('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@updateAuction')->where('id', '\d+');
        $router->delete('api/auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@deleteAuction')->where('id', '\d+');

    }
}