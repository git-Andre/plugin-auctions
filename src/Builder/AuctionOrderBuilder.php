<?php //strict

    namespace PluginAuctions\Builder;

    use Plenty\Plugin\Application;
//    use PluginAuctions\Services\Database\AuctionsService;


    /**
     * Class AuctionOrderBuilder
     * @package IO\Builder\Order
     */
    class AuctionOrderBuilder {

        /**
         * @var Application
         */
        private $app;

//        private $auctionService;


        public function __construct(Application $app, AuctionsService $auctionService)
        {
            $this -> app = $app;
//            $this -> auctionService = $auctionService;
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
                    "app"            => $this -> app,
//                    "auctionService" => $this -> auctionService,
                    "type"           => (int) $type,
                    "plentyId"       => $plentyId
                ]
            );

            if ( ! $instance instanceof AuctionOrderBuilderQuery)
            {
                throw new \Exception('Error while instantiating AuctionOrderBuilderQuery');
            }

            return $instance;
        }
    }