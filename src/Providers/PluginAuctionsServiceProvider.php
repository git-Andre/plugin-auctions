<?php

    namespace PluginAuctions\Providers;

    use Plenty\Plugin\ServiceProvider;
    use IO\Middlewares\Middleware;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use PluginAuctions\Models\Auction_4;
    use IO\Extensions\TwigIOExtension;
    use IO\Extensions\TwigServiceProvider;
    use Plenty\Plugin\Templates\Twig;

    use PluginAuctions\Extensions\TwigAuctionsServiceProvider;


    /**
     * Class PluginAuctionsServiceProvider
     * @package PluginAuctions\Providers
     */
    class PluginAuctionsServiceProvider extends ServiceProvider {

        /**
         * Register the route service provider
         */
        public function register()
        {
            $this -> getApplication() -> register(PluginAuctionsRouteServiceProvider::class);
//        $this->getApplication()->bind(AuctionsRepositoryContract::class, AuctionRepository::class);
            $this->addGlobalMiddleware(Middleware::class);

        }

        public function boot(Twig $twig)
        {
            $twig -> addExtension(TwigAuctionsServiceProvider::class);
        }
    }