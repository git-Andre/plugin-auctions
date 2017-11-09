<?php

    namespace PluginAuctions\Crons;

    use Plenty\Modules\Cron\Contracts\CronHandler as Cron;
    use Plenty\Plugin\Log\Loggable;
    use PluginAuctions\Constants\AuctionStatus;
    use PluginAuctions\Services\AuctionOrderService;
    use PluginAuctions\Services\Database\AuctionsService;

    //use Etsy\Services\Batch\Item\ItemExportService;
//use Etsy\Helper\AccountHelper;
//use Etsy\Helper\SettingsHelper;


    /**
     * Class ItemExportCron
     */
    class AuctionToOrderCron extends Cron {

        use Loggable;

        public $auctionOrderService;
        public $auctionsService;

        public function __construct(AuctionOrderService $auctionOrderService, AuctionsService $auctionsService)
        {
            $this -> auctionOrderService = $auctionOrderService;
            $this -> auctionsService = $auctionsService;
        }

        public function handle()
        {
            $endedAuctionIds = [];

            $endedAuctionIds = $this -> auctionsService -> getAuctionsInPast();

            if ($endedAuctionIds)
            {
                foreach ($endedAuctionIds as $endedAuctionId)
                {
                    try
                    {
                        $localizedOrder = $this -> auctionOrderService -> placeOrder($endedAuctionId);

                        $this -> getLogger(__METHOD__)
                              -> setReferenceType('testedId')
                              -> setReferenceValue($endedAuctionId)
                              -> debug('PluginAuctions::auctions.debugCronHelper', ['$localizedOrder: ' => $localizedOrder]);

                        if ($localizedOrder)
                        {
                            $this -> auctionsService -> updateAuctionWithTense($endedAuctionId, AuctionStatus::PAST_PERFECT);

                            $this -> getLogger(__METHOD__)
                                  -> setReferenceType('auctionId')
                                  -> setReferenceValue($endedAuctionId)
                                  -> debug('PluginAuctions::auctions.debugCronHelper', ['AuctionStatus: ' => AuctionStatus::PAST_PERFECT]);

                        }
                    }
                    catch ( \Exception $exception )
                    {
                        $this -> getLogger(__FUNCTION__) -> error('PluginAuctions::auctions.error', $exception);
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
