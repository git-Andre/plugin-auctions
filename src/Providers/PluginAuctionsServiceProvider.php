<?php

    namespace PluginAuctions\Providers;

    use IO\Middlewares\Middleware;
    use Plenty\Plugin\ServiceProvider;
    use Plenty\Plugin\Templates\Twig;
    use PluginAuctions\Extensions\TwigAuctionsServiceProvider;
    use PluginAuctions\Extensions\TwigLiveAuctionServiceProvider;
    use PluginAuctions\Services\AuctionOrderService;


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

//            $this -> addGlobalMiddleware(Middleware::class);

            $this -> getApplication() -> singleton(AuctionOrderService::class);

        }

        public function boot(Twig $twig)
        {
            $twig -> addExtension(TwigAuctionsServiceProvider::class);

//            //Register the PayUponPickup Plugin
//            $payContainer -> register('plenty::CASH', PayUponPickupPaymentMethod::class,
//                [AfterBasketChanged::class, AfterBasketItemAdd::class, AfterBasketCreate::class]);

        }
    }