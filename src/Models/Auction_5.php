<?php


    namespace PluginAuctions\Models;

    use Plenty\Modules\Plugin\DataBase\Contracts\Model;

    /**
     * Class Auction_5
     *
     * @property int $id
     * @property int $createdAt
     * @property int $updatedAt
     * @property int $variationId
     * @property int $startDate
     * @property int $startHour
     * @property int $startMinute
     * @property int $auctionDuration
     * @property int $expiryDate
     * @property float $currentPrice
     * @property boolean $isEnded
     * @property boolean $isLive
     * @property array $bidderList
     */
    class Auction_5 extends Model {

        const NAMESPACE = 'PluginAuctions\Models\Auction_5';

        public $id              = 0;
        public $createdAt       = 0;
        public $updatedAt       = 0;
        public $variationId     = 0;
        public $startDate       = 0;
        public $startHour       = 19;
        public $startMinute     = 1;
        public $auctionDuration = 10;
        public $currentPrice    = 1.99;

        public $expiryDate;

        public $isEnded    = false;
        public $isLive     = false;
        public $bidderList = array ();


        /**
         * @return string
         */
        public function getTableName() : string
        {
            return 'PluginAuctions::Auction_5';
        }

        public function fillByAttributes($attributes)
        {
            foreach ($attributes as $attr => $val)
            {
                if (array_key_exists($attr, $this -> jsonSerialize()))
                {
                    $ref = &$this -> getVarRef($attr);
                    $ref = $val;
                }
            }
        }

        /**
         * Specify data which should be serialized to JSON
         * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
         * @return mixed data which can be serialized by <b>json_encode</b>,
         * which is a value of any type other than a resource.
         * @since 5.4.0 (von IO::ItemWishList übernommen...)
         */
        function jsonSerialize()
        {
            return [
                'id'              => $this -> id,
                'createdAt'       => $this -> createdAt,
                'updatedAt'       => $this -> updatedAt,
                'variationId'     => $this -> variationId,
                'startDate'       => $this -> startDate,
                'startHour'       => $this -> startHour,
                'startMinute'     => $this -> startMinute,
                'auctionDuration' => $this -> auctionDuration,
                'expiryDate'      => $this -> expiryDate,
                'currentPrice'    => $this -> currentPrice,
                'isEnded'         => $this -> isEnded,
                'isLive'          => $this -> isLive,
                'bidderList'      => $this -> bidderList,
            ];
        }

        private function &getVarRef($varName)
        {
            switch ($varName)
            {
                case 'id'               :
                    return $this -> id;
                case 'createdAt'        :
                    return $this -> createdAt;
                case 'updatedAt'        :
                    return $this -> updatedAt;
                case 'variationId'        :
                    return $this -> variationId;
                case 'startDate'        :
                    return $this -> startDate;
                case 'startHour'        :
                    return $this -> startHour;
                case 'startMinute'        :
                    return $this -> startMinute;
                case 'auctionDuration'        :
                    return $this -> auctionDuration;
                case 'expiryDate'        :
                    return $this -> expiryDate;
                case 'currentPrice'        :
                    return $this -> currentPrice;
                case 'isEnded'        :
                    return $this -> isEnded;
                case 'isLive'        :
                    return $this -> isLive;
                case 'bidderList'        :
                    return $this -> bidderList;
            }
        }
    }