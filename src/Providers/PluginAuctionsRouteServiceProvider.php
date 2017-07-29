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

        $router->get('auction', 'PluginAuctions\Controllers\PluginAuctionsController@showAuctions');
        $router->post('auction', 'PluginAuctions\Controllers\PluginAuctionsController@createAuction');
        $router->put('auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@updateAuction')->where('id', '\d+');
        $router->delete('auction/{id}', 'PluginAuctions\Controllers\PluginAuctionsController@deleteAuction')->where('id', '\d+');

    }
}