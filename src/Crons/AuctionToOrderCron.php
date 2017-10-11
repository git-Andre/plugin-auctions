<?php

namespace PluginAuctions\Crons;

use Plenty\Modules\Cron\Contracts\CronHandler as Cron;
use Plenty\Plugin\Log\Loggable;

//use Etsy\Services\Batch\Item\ItemExportService;
//use Etsy\Helper\AccountHelper;
//use Etsy\Helper\SettingsHelper;

use PluginAuctions\Services\AuctionOrderService;


/**
 * Class ItemExportCron
 */
class AuctionToOrderCron extends Cron
{
	use Loggable;

	private $auctionOrderService;

	public function __construct(AuctionOrderService $auctionOrderService)
	{
		$this->auctionOrderService = $auctionOrderService;
	}

	public function handle()
	{
		try
		{
            $this->auctionOrderService ->placeOrder(11);
		}
		catch(\Exception $ex)
		{
			$this->getLogger(__FUNCTION__)->error('PluginAuctions::item.itemExportError', $ex->getMessage());
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
