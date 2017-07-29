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
        $router->get('hello-world','PluginAuctions\Controllers\PluginAuctionsController@getHelloWorldPage');
    }
}