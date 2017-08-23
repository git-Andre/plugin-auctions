<?php

    namespace PluginAuctions\Services\Database;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use PluginAuctions\Models\Auction_7;
    use PluginAuctions\Models\Fields\AuctionBidderListEntry;

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
            $results = $this -> getValues(Auction_7::class);

            return json_encode($results);
        }

        public function getAuctionForItemId($itemId)
        {
            if ($itemId > 0)
            {
                $auction = $this -> getValues(Auction_7::class, ['itemId'], [$itemId]);
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
                $auction = $this -> getValue(Auction_7::class, $id);
                if ($auction instanceof Auction_7)
                {
                    return $auction;
                }
            }

            return 'falsche ID';
        }

        /**
         * @param $newBackendAuction
         * @return bool|\Plenty\Modules\Plugin\DataBase\Contracts\Model
         */
        public function createAuction($newBackendAuction)
        {
            if ($newBackendAuction)
            {

                $auction = pluginApp(Auction_7::class);


                $auction -> itemId = $newBackendAuction ['itemId'];
                $auction -> startDate = $newBackendAuction ['startDate'];
                $auction -> startHour = $newBackendAuction ['startHour'];
                $auction -> startMinute = $newBackendAuction ['startMinute'];
                $auction -> auctionDuration = $newBackendAuction ['auctionDuration'];
                $auction -> currentPrice = (float) ($newBackendAuction ['currentPrice']);

                $endDate = $auction -> startDate + ($auction -> auctionDuration * 24 * 60 * 60);
                $auction -> expiryDate = $endDate;

                $now = time();

                $auction -> tense = $this -> calculateTense($auction -> startDate, $endDate);

                $auction -> createdAt = time();

                $bidderEntry = pluginApp(AuctionBidderListEntry::class);

                $auction -> bidderList[0] = $bidderEntry;

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
        public function updateAuction($id, $updatedBackendAuction)
        {
            if ($updatedBackendAuction)
            {
                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
                    $auction -> startDate = $updatedBackendAuction ['startDate'];
                    $auction -> startHour = $updatedBackendAuction ['startHour'];
                    $auction -> startMinute = $updatedBackendAuction ['startMinute'];
                    $auction -> auctionDuration = $updatedBackendAuction ['auctionDuration'];
                    $auction -> currentPrice = (float) ($updatedBackendAuction ['currentPrice']);

                    $endDate = $auction -> startDate + ($auction -> auctionDuration * 24 * 60 * 60);
                    $auction -> expiryDate = $endDate;

                    $auction -> isEnded = true;
                    $auction -> isLive = true;

                    $auction -> tense = $this -> calculateTense($auction -> startDate, $endDate);

                    $auction -> updatedAt = time();

                    return $this -> setValue($auction);
                }

                return 'Diese ID: ' + $id + ' ist uns nicht bekannt';
            }

            return false;
        }

        /**
         * @param $auctionId
         * @return bool|string
         */
        public function deleteAuction($id)
        {
            if ($id && $id > 0)
            {
                $auctionModel = pluginApp(Auction_7::class);
                $auctionModel -> id = $id;

                return json_encode($this -> deleteValue($auctionModel));
            }

            return 'Auctionsservice - delete Auction - Bedingung nicht erfüllt';
        }

        /**
         * @param number $startDate
         * @param number $durationInDays
         * @return number
         */
        public function calculateTense($startDate, $endDate) : string
        {
            $now = time();

            if ($auction -> startDate < $now && $endDate < $now)
            {
                return $auction -> tense = 'past';
            }
            elseif ($auction -> startDate > $now && $endDate < $now)
            {
                return $auction -> tense = 'present';
            }
            elseif ($auction -> startDate > $now && $endDate > $now)
            {
                return $auction -> tense = 'future';
            }
            return false;
        }

    }