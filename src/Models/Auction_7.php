<?php


    namespace PluginAuctions\Models;

    use Plenty\Modules\Plugin\DataBase\Contracts\Model;


    /**
     * Class Auction_7
     *
     * @property int $id
     * @property int $createdAt
     * @property int $updatedAt
     * @property int $itemId
     * @property int $startDate
     * @property int $startHour
     * @property int $startMinute
     * @property int $auctionDuration
     * @property int $expiryDate
     * @property float $startPrice
     * @property string $tense
     * @property array $bidderList
     */
    class Auction_7 extends Model implements \JsonSerializable {

        const NAMESPACE = 'PluginAuctions\Models\Auction_7';
//auto
        public $id        = 0;
        public $createdAt = 0;
        public $updatedAt = 0;
//input per form
        public $itemId          = 0;
        public $startDate       = 0;
        public $startHour       = 19;
        public $startMinute     = 1;
        public $auctionDuration = 10;
        public $startPrice    = 1.99;
//calculated
        public $expiryDate = 0;

        public $tense      = "init";
        public $bidderList = array ();

        /**
         * @return string
         */
        public function getTableName() : string
        {
            return 'PluginAuctions::Auction_7';
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
                'itemId'          => $this -> itemId,
                'startDate'       => $this -> startDate,
                'startHour'       => $this -> startHour,
                'startMinute'     => $this -> startMinute,
                'auctionDuration' => $this -> auctionDuration,
                'expiryDate'      => $this -> expiryDate,
                'startPrice'      => $this -> startPrice,
                'tense'           => $this -> tense,
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
                case 'itemId'        :
                    return $this -> itemId;
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
                case 'startPrice'        :
                    return $this -> startPrice;
                case 'tense'        :
                    return $this -> tense;
                case 'bidderList'        :
                    return $this -> bidderList;
            }
        }
    }