<?php

namespace PluginAuctions\Providers;

use Plenty\Plugin\ServiceProvider;
use PluginAuctions\Contracts\AuctionsRepositoryContract;
use PluginAuctions\Repositories\AuctionRepository;

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
        $this->getApplication()->bind(AuctionsRepositoryContract::class, AuctionRepository::class);
    }

}