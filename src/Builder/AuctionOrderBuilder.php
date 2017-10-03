<?php //strict

namespace PluginAuctions\Builder;

use Plenty\Plugin\Application;
use Plenty\Modules\Basket\Models\Basket;
use IO\Services\BasketService;
//use PluginAuctions\Builder\AuctionOrderBuilderQuery;


/**
 * Class AuctionOrderBuilder
 * @package IO\Builder\Order
 */
class AuctionOrderBuilder
{
	/**
	 * @var Application
	 */
	private $app;

	public function __construct(Application $app)
	{
		$this->app           = $app;
	}
	
	public function prepare(int $type, int $plentyId = 0):AuctionOrderBuilderQuery
	{
		if($plentyId == 0)
		{
			$plentyId = $this->app->getPlentyId();
		}
		
		$instance = $this->app->make(
			AuctionOrderBuilderQuery::class,
			[
				"app"           => $this->app,
//				"basketService" => $this->basketService,
				"type"          => (int)$type,
				"plentyId"      => $plentyId
			]
		);
		
		if(!$instance instanceof AuctionOrderBuilderQuery)
		{
			throw new \Exception('Error while instantiating AuctionOrderBuilderQuery');
		}
		return $instance;
	}
}