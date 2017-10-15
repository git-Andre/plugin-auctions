<?php

    namespace PluginAuctions\Providers;

    use Plenty\Log\Exceptions\ReferenceTypeException;
    use Plenty\Log\Services\ReferenceContainer;
    use Plenty\Modules\Cron\Services\CronContainer;
    use Plenty\Plugin\ServiceProvider;
    use Plenty\Plugin\Templates\Twig;
    use PluginAuctions\Crons\AuctionToOrderCron;
    use PluginAuctions\Extensions\TwigAuctionsServiceProvider;
    use PluginAuctions\Extensions\TwigLiveAuctionServiceProvider;


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
            $container -> add(CronContainer::EVERY_FIFTEEN_MINUTES, AuctionToOrderCron::class);

            // register reference types for logs
            try
            {
                $referenceContainer -> add(['auctionId' => 'auctionId','auctionVarId' => 'auctionVarId', 'tense' => 'tense']);
            }
            catch ( ReferenceTypeException $ex )
            {
            }

            // twig service auction
            $twig -> addExtension(TwigAuctionsServiceProvider::class);

//            //Register the PayUponPickup Plugin
//            $payContainer -> register('plenty::CASH', PayUponPickupPaymentMethod::class,
//                [AfterBasketChanged::class, AfterBasketItemAdd::class, AfterBasketCreate::class]);

        }
    }