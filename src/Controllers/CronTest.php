<?php

    namespace PluginAuctions\Controllers;

    use IO\Controllers\LayoutController;

    use Plenty\Modules\Cron\Contracts\CronHandler as Cron;
    use Plenty\Plugin\Log\Loggable;
    use PluginAuctions\Constants\AuctionStatus;
    use PluginAuctions\Services\AuctionOrderService;
    use PluginAuctions\Services\Database\AuctionsService;
    use IO\Services\ItemService;
    use Plenty\Plugin\ConfigRepository;


    /**
     * Class ItemExportCron
     */
    class CronTest extends LayoutController {

        use Loggable;

        public $auctionOrderService;
        public $auctionsService;

        public function __construct(AuctionOrderService $auctionOrderService, AuctionsService $auctionsService)
        {
            $this -> auctionOrderService = $auctionOrderService;
            $this -> auctionsService = $auctionsService;
        }

        public function cronTest()
        {
            $endedAuctionIds = [];

            $config = pluginApp(ConfigRepository::class);
            if ($config->get("PluginAuctions.global.shippingProfile") != 35)
            {
                $this -> getLogger(__METHOD__)
                      -> debug('PluginAuctions::auctions.debugBefor', ['TEST?: ' => $config->get("PluginAuctions.global.shippingProfile")]);
                return $config->get("PluginAuctions.global.paymentMethod");
            }

            $endedAuctionIds = $this -> auctionsService -> getAuctionsInPast();

            $this -> getLogger(__METHOD__)
                  -> debug('PluginAuctions::auctions.debugCronHelper', ['$endedAuctionIds: ' => $endedAuctionIds]);

            if ($endedAuctionIds)
            {
                foreach ($endedAuctionIds as $endedAuctionId)
                {
                    try
                    {
                        $localizedOrder = $this -> auctionOrderService -> placeOrder($endedAuctionId);

                        $this -> getLogger(__METHOD__)
                              -> setReferenceType('auctionId')
                              -> setReferenceValue($endedAuctionId)
                              -> info('PluginAuctions::auctions.newOrder', ['newOrderId: ' => $localizedOrder -> order -> id]);

                        $this -> auctionsService -> updateAuctionWithTense($endedAuctionId, AuctionStatus::PAST_PERFECT);
                    }
                    catch ( \Exception $exception )
                    {
                        $this -> getLogger(__FUNCTION__) -> error('PluginAuctions::Auction to Order CRON-Error', $exception);
                    }
                }
            }
        }

        /**
         * Get the last run.
         *
         * @return string|null
         */
    }
