<?php //strict

    namespace PluginAuctions\Builder;

    use Plenty\Plugin\Application;
    use PluginAuctions\Services\AuctionHelperService;


    /**
     * Class AuctionOrderBuilder
     * @package IO\Builder\Order
     */
    class AuctionOrderBuilder {

        /**
         * @var Application
         */
        private $app;

        private $auctionHelperService;


        public function __construct(Application $app, AuctionHelperService $auctionHelperService)
        {
            $this -> app = $app;
            $this -> auctionHelperService = $auctionHelperService;
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
                    "auctionHelperService" => $this -> auctionHelperService,
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