<?php

    namespace PluginAuctions\Models;

    use Plenty\Modules\Plugin\DataBase\Contracts\Model;
//    use PluginAuctions\Models\Fields\LiveAuctionBidFields;

    /**
     * Class LiveAuction_1
     * @package PluginAuctions\Models
     */
    class LiveAuction_1 extends Model {
        public $id = 0;
        public $createdAt = 0;
        public $itemId = 0;
        public $auctionId = 0;

        public $bidderList = [];

        public $isEnded = false;
        public $isLive = false;
        public $isEndedWithBuyNow = false;

    /**
     * @return string
     */
    public function getTableName() : string
    {
        return 'PluginAuctions::LiveAuction_1';
    }
}