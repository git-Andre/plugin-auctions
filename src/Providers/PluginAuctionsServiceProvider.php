<?php

    namespace PluginAuctions\Providers;

    use IO\Middlewares\Middleware;

    use Plenty\Plugin\ServiceProvider;
    use Plenty\Plugin\Templates\Twig;
    use Plenty\Modules\Cron\Services\CronContainer;
    use Plenty\Log\Services\ReferenceContainer;
    use Plenty\Log\Exceptions\ReferenceTypeException;

    use PluginAuctions\Extensions\TwigAuctionsServiceProvider;
    use PluginAuctions\Extensions\TwigLiveAuctionServiceProvider;
    use PluginAuctions\Services\AuctionOrderService;
    use PluginAuctions\Crons\AuctionToOrderCron;


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
//            $this -> getApplication() -> register(AuctionOrderService::class);

        }

        public function boot(Twig $twig, CronContainer $container, ReferenceContainer $referenceContainer)
        {
            // register crons
            $container->add(CronContainer::EVERY_FIFTEEN_MINUTES, AuctionToOrderCron::class);

            // register reference types for logs
            $referenceContainer -> add(['auctionId' => 'auctionId', 'orderId' => 'orderId']);

            // twig service auction
            $twig -> addExtension(TwigAuctionsServiceProvider::class);

//            //Register the PayUponPickup Plugin
//            $payContainer -> register('plenty::CASH', PayUponPickupPaymentMethod::class,
//                [AfterBasketChanged::class, AfterBasketItemAdd::class, AfterBasketCreate::class]);

        }
    }