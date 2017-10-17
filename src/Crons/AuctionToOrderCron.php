<?php

    namespace PluginAuctions\Crons;

    use Plenty\Modules\Cron\Contracts\CronHandler as Cron;
    use Plenty\Plugin\Log\Loggable;
    use PluginAuctions\Constants\AuctionStatus;
    use PluginAuctions\Services\AuctionOrderService;
    use PluginAuctions\Services\Database\AuctionsService;
    use IO\Services\ItemService;
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

            $this -> getLogger(__METHOD__)
                  -> debug('PluginAuctions::auctions.debugCronHelper', ['$endedAuctionIds: ' => $endedAuctionIds ]);

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
//	private function lastRun()
//	{
//		return $this->settingsHelper->get(SettingsHelper::SETTINGS_LAST_ITEM_EXPORT);
//	}
//
//	/**
//	 * Save the last run.
//	 */
//	private function saveLastRun()
//	{
//		$this->settingsHelper->save(SettingsHelper::SETTINGS_LAST_ITEM_EXPORT, date('Y-m-d H:i:s'));
//	}
    }
