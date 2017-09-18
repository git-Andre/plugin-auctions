<?php

    namespace PluginAuctions\Models\Fields;

    /**
     * Class ItemBaseFields
     * @package IO\Builder\Item\Fields
     */
    class AuctionBidderListEntry {


        public $bidderName     = "Startpreis";
        public $bidPrice       = 0.3;
        public $bidTimeStamp   = 1500000000;
        public $bidStatus      = "start";
        public $customerId     = 0;
        public $customerMaxBid = 0.4;
    }