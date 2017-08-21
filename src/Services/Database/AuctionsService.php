<?php

    namespace PluginAuctions\Services\Database;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use PluginAuctions\Models\Auction_5;

    //    use Illuminate\Support\Facades\App;
//    use Plenty\Modules\Plugin\DynamoDb\Contracts\DynamoDbRepositoryContract;


    class AuctionsService extends DataBaseService {


        protected $tableName = 'auctions';

        /**
         * AuctionsService constructor.
         * @param DataBase $dataBase
         */

        public function __construct(DataBase $dataBase)
        {
            parent ::__construct($dataBase);
        }


        /**
         * @return array|bool
         */
        public function getAuctions()
        {
            $results = $this -> getValues(Auction_5::class);

            return  json_encode($results);
        }

        public function getAuctionForItemId($variationId)
        {
            if ($variationId > 0)
            {
                $auction = $this -> getValues(Auction_5::class, ['variationId'], [$variationId]);
                if ($auction[0])
                {
                    return $auction[0];
                }
            }

            return false;
        }


        /**
         * @param $auctionId
         * @return bool|mixed|string
         */
        public function getAuction($id)
        {
            if ($id > 0)
            {
                $auction = $this -> getValue(Auction_5::class, $id);
                if ($auction instanceof Auction_5)
                {
                    return $auction;
                }
            }

            return 'falsche ID';
        }

        /**
         * @param $newAuction
         * @return bool|string
         */
        public function createAuction($newAuction)
        {
            if ($newAuction)
            {

                $auction = pluginApp(Auction_5::class);


                $auction -> variationId = $newAuction ['variationId'];
                $auction -> startDate = $newAuction ['startDate'];
                $auction -> startHour = $newAuction ['startHour'];
                $auction -> startMinute = $newAuction ['startMinute'];
                $auction -> auctionDuration = $newAuction ['auctionDuration'];
                $auction -> currentPrice = $newAuction ['currentPrice'];

                $auctionDuration = $newAuction ['auctionDuration'];

                $start = $newAuction ['startDate'];

                $startDate = date_create("@$start");
                $endDate = date_create("@$start");
                $endDate = date_modify($endDate, "+$auctionDuration day");

                $auction -> expiryDate = $endDate;

                $now = date_create("now");

                ($startDate < $now) ? $auction -> isLive = true : $auction -> isLive = false;
                ($endDate < $now) ? $auction -> isEnded = true : $auction -> isEnded = false;

                $auction -> createdAt = time();

                $auction -> bidderList = ['bidderName'     => 'Startpreis',
                                          'customerId'     => null,
                                          'customerMaxBid' => 0,
                                          'bidPrice'       => $newAuction -> currentPrice,
                                          'bidTimeStamp'   => $auction -> createdAt,
                ];
                $auction -> updatedAt = $auction -> createdAt;

                return $this -> setValue($auction);
            }

            return false;
        }

        /**
         * @param $id
         * @param $auctionData
         * @return string
         */
        public function updateAuction($id, $auctionData)
        {
            if ($auctionData)
            {
                $auction = $this -> getValue(Auction_5::class, $id);

                if ($auction instanceof Auction_5)
                {
                    $auction -> startDate = $auctionData ['startDate'];
                    $auction -> startHour = $auctionData ['startHour'];
                    $auction -> startMinute = $auctionData ['startMinute'];
                    $auction -> auctionDuration = $auctionData ['auctionDuration'];
                    $auction -> currentPrice = $auctionData ['currentPrice'];

                    $auctionDuration = $auctionData ['auctionDuration'];
                    $start = $auctionData ['startDate'];

                    $auction -> expiryDate = $this -> calculatedExpiryDate($start, $auctionDuration);

                    $auction -> updatedAt = time();

                    return $this -> setValue($auction);
                }

                return 'Diese ID: ' + $id + ' ist uns nicht bekannt';
            }

            return json_encode($auction);

        }

        /**
         * @param number $startDate
         * @param number $durationInDays
         * @return number
         */
        private function calculatedExpiryDate($startDate, $durationInDays) : number
        {

            $start = date_create("@$startDate");
            $end = date_create("@$startDate");

            return date_modify($end, "+$durationInDays day");
        }

        /**
         * @param $auctionId
         * @return bool|string
         */
        public function deleteAuction($id)
        {
            if ($id && $id > 0)
            {
                /* @var Auction $auctionModel */
                $auctionModel = pluginApp(Auction_5::class);
                $auctionModel -> id = $id;

                return $this -> deleteValue($auctionModel);
            }

            return 'Auctionsservice - Bedingung nicht erfüllt';
        }

    }