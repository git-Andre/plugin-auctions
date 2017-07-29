<?php

namespace PluginAuctions\Providers;

use Plenty\Plugin\ServiceProvider;

/**
 * Class PluginAuctionsServiceProvider
 * @package PluginAuctions\Providers
 */
class PluginAuctionsServiceProvider extends ServiceProvider
{
    /**
    * Register the route service provider
    */
    public function register()
    {
        $this->getApplication()->register(PluginAuctionsRouteServiceProvider::class);
    }
}