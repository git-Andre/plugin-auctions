<?php //strict

    namespace PluginAuctions\Builder;

    use Plenty\Plugin\Application;
    use PluginAuctions\Services\AuctionParamsService;


    /**
     * Class AuctionOrderBuilder
     * @package IO\Builder\Order
     */
    class AuctionOrderBuilder {

        /**
         * @var Application
         */
        private $app;

        private $auctionParamsService;


        public function __construct(Application $app, AuctionParamsService $auctionParamsService)
        {
            $this -> app = $app;
            $this -> auctionParamsService = $auctionParamsService;
        }

        public function prepare(int $type, int $plentyId = 0) : AuctionOrderBuilderQuery
        {
            if ($plentyId == 0)
            {
                $plentyId = $this -> app -> getPlentyId();
            }

            $instance = $this -> app -> make(
                AuctionOrderBuilderQuery::class,
                [
                    "app"                  => $this -> app,
                    "auctionParamsService" => $this -> auctionParamsService,
                    "type"                 => (int) $type,
                    "plentyId"             => $plentyId
                ]
            );

            if ( ! $instance instanceof AuctionOrderBuilderQuery)
            {
                throw new \Exception('Error while instantiating AuctionOrderBuilderQuery');
            }

            return $instance;
        }
    }