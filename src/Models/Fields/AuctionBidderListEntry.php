<?php

    namespace PluginAuctions\Models\Fields;

    /**
     * Class ItemBaseFields
     * @package IO\Builder\Item\Fields
     */
    class AuctionBidderListEntry {


        public $bidderName     = 'Startpreis';
        public $customerId     = 0;
        public $customerMaxBid = 0.1;
        public $bidPrice       = 0.1;
        public $bidTimeStamp   = 0;
    }