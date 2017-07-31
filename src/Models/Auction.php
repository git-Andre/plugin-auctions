<?php

    namespace PluginAuctions\Models;

    use Plenty\Modules\Plugin\DataBase\Contracts\Model;

    /**
     * Class Auction
     *
     * @property int $id
     * @property int $createdAt
     * @property int $updatedAt
     * @property int $itemId
     * @property int $startDate
     * @property int $startHour
     * @property int $startMinute
     * @property int $auctionDuration
     * @property double $startPrice
     * @property double $buyNowPrice
     */

    class Auction extends Model {

        /**
         * @var int
         */
        public $id = 0;
        public $createdAt = 0;
        public $updatedAt = 0;
        public $itemId = 0;
        public $startDate = 0;
        public $startHour = 19;
        public $startMinute = 1;
        public $auctionDuration = 10;
        public $startPrice = 1.99;
        public $buyNowPrice = 0;

    /**
     * @return string
     */
    public function getTableName() : string
    {
        return 'PluginAuctions::Auction';
    }
}