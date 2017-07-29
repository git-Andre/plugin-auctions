<?php

    namespace PluginAuctions\Models;

    use Plenty\Modules\Plugin\DataBase\Contracts\Model;

    /**
     * Class Auction
     *
     * @property int $id
     * @property int $createdAt
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
        public $itemId = 0;
        public $startDate = 0;
        public $startHour = 0;
        public $startMinute = 0;
        public $auctionDuration = 0;
        public $startPrice = 0;
        public $buyNowPrice = 0;

    /**
     * @return string
     */
    public function getTableName() : string
    {
        return 'PluginAuctions::Auction';
    }
}