<?php

    namespace PluginAuctions\Crons;

    use Plenty\Modules\Cron\Contracts\CronHandler as Cron;
    use Plenty\Plugin\Log\Loggable;
    use PluginAuctions\Services\AuctionOrderService;

//use Etsy\Services\Batch\Item\ItemExportService;
//use Etsy\Helper\AccountHelper;
//use Etsy\Helper\SettingsHelper;


    /**
     * Class ItemExportCron
     */
    class AuctionToOrderCron extends Cron {

        use Loggable;

        public $auctionOrderService;

        public function __construct(AuctionOrderService $auctionOrderService)
        {
            $this -> auctionOrderService = $auctionOrderService;
        }

        public function handle()
        {
            $auctionId = 11;

            try
            {
//               $test = $this -> auctionOrderService -> placeOrder($auctionId);
                $this -> getLogger('Crons/AuctionToOrderCron::handle') -> info('Schaffrath::Auction to Order', 'test: ' . $auctionId);
            }
            catch ( \Exception $exception )
            {
                $this -> getLogger(__FUNCTION__) -> error('Schaffrath::Auction to Order Fehler', $exception);
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
