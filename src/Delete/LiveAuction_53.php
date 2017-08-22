<?php

    namespace PluginAuctions\Models;

    use Plenty\Modules\Plugin\DataBase\Contracts\Model;

//    use PluginAuctions\Models\Fields\AuctionBidderListEntry;

    /**
     * Class LiveAuction_53
     * @package PluginAuctions\Models
     */
    class LiveAuction_53 extends Model {

        /**
         * @var int
         */
        public $id = 0;
        public $createdAt = 0;
        public $itemId = 0;
        public $auctionId = 0;

        public $isEnded = false;
        public $isLive = false;
        public $isEndedWithBuyNow = false;
        public $bidderList = array ();

//        public $bidderList = [AuctionBidderListEntry::CUSTOMER_EMAIL => 'eme_***_end',
//                                      AuctionBidderListEntry::BID_PRICE => 0,
//                                      AuctionBidderListEntry::BID_TIMESTAMP => 1502919564];
        /**
         * @return string
         */
        public function getTableName() : string
        {
            return 'PluginAuctions::LiveAuction_53';
        }
    }