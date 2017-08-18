<?php

    namespace PluginAuctions\Services\Database;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use PluginAuctions\Models\LiveAuction_53;

    //    use Illuminate\Support\Facades\App;
//    use Plenty\Modules\Plugin\DynamoDb\Contracts\DynamoDbRepositoryContract;


    class LiveAuctionsService extends DataBaseService {


        protected $tableName = 'liveAuctions';

        /**
         * LiveAuctionsService constructor.
         * @param DataBase $dataBase
         */

        public function __construct(DataBase $dataBase)
        {
            parent ::__construct($dataBase);
        }


        /**
         * @return array|bool
         */
        public function getLiveAuctions()
        {
            $results = $this -> getValues(LiveAuction_53::class);

            if ($results)
            {

                return $results;
            }

            return 'results in getLiveAuctions = false';
        }

//        public function getAuctionForItemId($itemId)
//        {
//            if ($itemId > 0)
//            {
//                $auction[] = $this -> getValues(Auction_4::class, ['itemId'], [$itemId]);
//                if ($auction[0])
//                {
//                    return $auction[0];
//                }
//            }
//
//            return 'ist die itemId richtig?';
//        }


//        /**
//         * @param $auctionId
//         * @return bool|mixed|string
//         */
//        public function getAuction($id)
//        {
//            if ($id > 0)
//            {
//                $auction = $this -> getValue(Auction_4::class, $id);
//                if ($auction instanceof Auction_4)
//                {
//                    return $auction;
//                }
//            }
//
//            return 'falsche ID';
//        }
//
        /**
         * @param $newAuction
         * @return bool|string
         */
        public function createLiveAuction($newLiveAuction)
        {
            if ($newLiveAuction)
            {

                $liveAuction = pluginApp(LiveAuction_53::class);


                $liveAuction -> itemId = $newLiveAuction ['itemId'];
                $liveAuction -> auctionId = $newLiveAuction ['auctionId'];

                $liveAuction -> bidderList = $newLiveAuction ['bidderList'];

                $liveAuction -> isEnded = $newLiveAuction ['isEnded'];
                $liveAuction -> isLive = $newLiveAuction ['isLive'];
                $liveAuction -> isEndedWithBuyNow = $newLiveAuction ['isEndedWithBuyNow'];




                $liveAuction -> createdAt = time();

//                return json_encode($liveAuction);
                return $this -> setValue($liveAuction);
            }

            return 'Fehler bei der Neuanlage der LiveAuction...';
        }

        /**
         * @param $id
         * @param $auctionData
         * @return string
         */
        public function updateLiveAuction($id, $liveAauctionData)
        {
            if ($liveAuctionData)
            {
                $liveAuction = $this -> getValue(LiveAuction_53::class, $id);

                if ($auction instanceof Auction_4)
                {

                    $liveAuction = pluginApp(LiveAuction_53::class);


                    $liveAuction -> itemId = $newLiveAuction ['itemId'];
                    $liveAuction -> auctionId = $newLiveAuction ['auctionId'];

                    $liveAuction -> bidderList = $newLiveAuction ['bidderList'];

                    $liveAuction -> isEnded = $newLiveAuction ['isEnded'];
                    $liveAuction -> isLive = $newLiveAuction ['isLive'];
                    $liveAuction -> isEndedWithBuyNow = $newLiveAuction ['isEndedWithBuyNow'];




                    $liveAuction -> createdAt = time();

                    return "ok, Auction Nr.: $id erfolgreich geändert!";
                }

                return 'Diese ID: ' + $id + ' ist uns nicht bekannt';
            }

            return json_encode($auction);

        }


        /**
         * @param $auctionId
         * @return bool|string
         */
        public function deleteLiveAuction($auctionId)
        {
            if ($auctionId && $auctionId > 0)
            {
                /* @var Auction $auctionModel */
                $auctionModel = pluginApp(LiveAuction_53::class);
                $auctionModel -> id = $auctionId;

                return $this -> deleteValue($auctionModel);
            }

            return 'Auctionsservice - Bedingung nicht erfüllt';
        }
    }