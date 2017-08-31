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
         * @return bool|string
         */
        public function getAuctions()
        {
            $auctions = $this -> getValues(Auction_7::class);
            if ($auctions)
            {
                foreach ($auctions as $auction)
                {
                    $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);
                }
                unset($auction);

                return json_encode($auctions);
            }

            return false;
        }

        /**
         * @param $startDate
         * @param $endDate
         * @return string
         */
        public function calculateTense($startDate, $endDate) : string
        {
            $now = time();

            if ($startDate < $now && $endDate < $now)
            {
                return 'past';
            }
            elseif ($startDate < $now && $endDate > $now)
            {
                return 'present';
            }
            elseif ($startDate > $now && $endDate > $now)
            {
                return 'future';
            }
            else
            {
                return 'Fehler - startDate: ' . $startDate . ' - endDate: ' . $endDate . ' - now: ' . $now;
            }
        }

        public function getAuctionForItemId($itemId)
        {
            if ($itemId > 0)
            {
                $auctionArray = $this -> getValues(Auction_7::class, ['itemId'], [$itemId]);
                $auction = (object) $auctionArray[0];
                if ($auction -> id)
                {
                    $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);

                    return $auction;
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
                    $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);

//                    $this -> setValue($auction);

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

                $auction -> expiryDate = $auction -> startDate + ($auction -> auctionDuration * 24 * 60 * 60);

                $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);

                $auction -> createdAt = time();

                $auction -> bidderList[0] = pluginApp(AuctionBidderListEntry::class);

                $auction -> updatedAt = $auction -> createdAt;

                return $this -> setValue($auction);
            }

            return false;
        }

        /**
         * @param $id
         * @param $updatedBackendAuction
         * @return bool|\Plenty\Modules\Plugin\DataBase\Contracts\Model|string
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

                    $auction -> expiryDate = $auction -> startDate + ($auction -> auctionDuration * 24 * 60 * 60);

                    $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);

                    $auction -> updatedAt = time();

                    return $this -> setValue($auction);
                }

                return 'Diese ID: ' + $id + ' ist uns nicht bekannt';
            }

            return false;
        }

        /**
         * @param $id
         * @param $bidderList
         * @return string
         */
        public function updateBidderList($id, $bidderList)
        {
            if ($bidderList)
            {
                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
                    $list = array (pluginApp(AuctionBidderListEntry::class));
                    $list = $auction -> bidderList;


                    $bidderList -> bidTimeStamp = time();
//
                    array_push($list, $bidderList);
//
                    $auction -> bidderList = $list;
//
                    $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);
//
//                    return json_encode($list);
                    return $this -> setValue($auction);
                }

                return 'Diese ID: ' + $id + ' ist uns nicht bekannt';
            }

            return 'test';
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

    }