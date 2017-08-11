<?php

    namespace PluginAuctions\Services\Database;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use PluginAuctions\Models\Auction_4;

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
//            $auctions = array ();
            $results = $this -> getValues(Auction_4::class);

            return $results;
        }

        /**
         * @param $auctionId
         * @return bool|mixed|string
         */
        public function getAuction($auctionId)
        {
            if ($auctionId > 0)
            {
                $auction = $this -> getValue(Auction_4::class, $auctionId);
                if ($auction instanceof Auction_4)
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

                $auction = pluginApp(Auction_4::class);


                $auction -> itemId = $newAuction ['itemId'];
                $auction -> startDate = $newAuction ['startDate'];
                $auction -> startHour = $newAuction ['startHour'];
                $auction -> startMinute = $newAuction ['startMinute'];
                $auction -> auctionDuration = $newAuction ['auctionDuration'];
                $auction -> startPrice = $newAuction ['startPrice'];
                $auction -> buyNowPrice = $newAuction ['buyNowPrice'];

                $auction -> createdAt = time();
                $auction -> updatedAt = $auction -> createdAt;

                return $this -> setValue($auction);
            }

            return 'Fehler bei der Neuanlage...';
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
                $auction = $this -> getValue(Auction_4::class, $id);

                if ($auction instanceof Auction_4)
                {

                    $auction -> itemId = $auctionData ['itemId'];
                    $auction -> startDate = $auctionData ['startDate'];
                    $auction -> startHour = $auctionData ['startHour'];
                    $auction -> startMinute = $auctionData ['startMinute'];
                    $auction -> auctionDuration = $auctionData ['auctionDuration'];
                    $auction -> startPrice = $auctionData ['startPrice'];
                    $auction -> buyNowPrice = $auctionData ['buyNowPrice'];

                    $auction -> updatedAt = time();

                    $this -> setValue($auction);
                }

                return "ok, Auction Nr.: $id erfolgreich geändert!";
            }

            return json_encode($auction);

        }


        /**
         * @param $auctionId
         * @return bool|string
         */
        public function deleteAuction($auctionId)
        {
            if ($auctionId && $auctionId > 0)
            {
                /* @var Auction $auctionModel */
                $auctionModel = pluginApp(Auction_4::class);
                $auctionModel -> id = $auctionId;

                return $this -> deleteValue($auctionModel);
            }

            return 'Auctionsservice - Bedingung nicht erfüllt';
        }
    }