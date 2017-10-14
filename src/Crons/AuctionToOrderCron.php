<?php

    namespace PluginAuctions\Crons;

    use Plenty\Modules\Cron\Contracts\CronHandler as Cron;
    use Plenty\Plugin\Log\Loggable;
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
            $auctionId = 11;
            $endedAuctions = [];

            $endedAuctions = $this -> auctionsService -> getAuctionsForTense("past");
            $this -> getLogger(__FUNCTION__) -> error('Schaffrath::Auction to Order Fehler 1', $exception);

            try
            {
//               $test = $this -> auctionOrderService -> placeOrder($auctionId);
                $this -> getLogger('Crons/AuctionToOrderCron::handle') -> debug('Schaffrath::Auction to Order', $endedAuctions);
                $this -> getLogger(__FUNCTION__) -> error('Schaffrath::Auction to Order Fehler 2', $exception);
            }
            catch ( \Exception $exception )
            {
                $this -> getLogger(__FUNCTION__) -> error('Schaffrath::Auction to Order Fehler 3', $exception);
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
