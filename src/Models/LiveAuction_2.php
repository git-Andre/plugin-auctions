<?php

    namespace PluginAuctions\Models;

    use Plenty\Modules\Plugin\DataBase\Contracts\Model;
//    use PluginAuctions\Models\Fields\LiveAuctionBidFields;

    /**
     * Class LiveAuction_2
     * @package PluginAuctions\Models
     */
    class LiveAuction_2 extends Model {

        public $id = 0;
        public $createdAt = 0;
        public $itemId = 0;
        public $auctionId = 0;

/*        public $bidderList = [LiveAuctionBidFields::CUSTOMER_EMAIL => 'eme_***_end',
                              LiveAuctionBidFields::BID_PRICE => 0,
                              LiveAuctionBidFields::BID_TIMESTAMP => 1502919564];*/

        public $isEnded = false;
        public $isLive = false;
        public $isEndedWithBuyNow = false;

        /**
         * @return string
         */
        public function getTableName() : string
        {
            return 'PluginAuctions::LiveAuction_2';
        }
    }