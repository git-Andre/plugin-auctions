<?php

    namespace PluginAuctions\Services\Database;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use PluginAuctions\Models\LiveAuction_53;

    //    use Illuminate\Support\Facades\App;
//    use Plenty\Modules\Plugin\DynamoDb\Contracts\DynamoDbRepositoryContract;


    class LiveAuctionsService extends DataBaseService {


        protected $tableName = 'liveAuctions';

        private $auctionsService;


        /**
         * LiveAuctionsService constructor.
         * @param DataBase $dataBase
         */

        public function __construct(DataBase $dataBase, AuctionsService $auctionsService)
        {
            parent ::__construct($dataBase);
            $this -> auctionsService = $auctionsService;
        }


        /**
         * @return array|bool|string
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

        public function getLiveAuctionForItemId($itemId)
        {
            if ($itemId > 0)
            {
                $liveAuction[] = $this -> getValues(LiveAuction_53::class, ['itemId'], [$itemId]);

                if ($liveAuction[0])
                {

                    $isEnded = false;
                    $isLive = true;

                    $auction = $this -> auctionsService -> getAuctionForItemId($itemId);


                    $startDate = $auction[0] -> startDate;
                    $startHour = $auction[0] -> startHour;
                    $startMinute = $auction[0] -> startMinute;
                    $auctionDuration = $auction[0] -> auctionDuration;

                    $startDate = $startDate + $startHour * 60*60 + $startMinute *60;
                    $endDate = $startDate + $auctionDuration * 24 * 60 * 60;
                    $now = time();

                    if ($auction[0])
                    {
                        return $auction[0] -> id;
                    }

                    if ($now - $startDate < 0)
                    {
                        $isLive = true;
                    } else
                    {
                        $isLive = false;
                    }

                    if ($now - $endDate > 0)
                    {
                        $isEnded = true;
                    } else
                    {
                        $isEnded = false;
                    }

                    $liveAuction[0] -> isLive = $isLive;
                    $liveAuction[0] -> isEnded = $isEnded;

                    return $liveAuction[0];
                }

                return "keine liveAuction[0] + $itemId ";
            }

            return 'ist die LiveAuction -> itemId richtig?';
        }


        /**
         * @param $id
         * @return bool|mixed|string
         */
        public function getLiveAuction($id)
        {
            if ($id > 0)
            {
                $liveAuction = $this -> getValue(LiveAuction_53::class, $id);
                if ($liveAuction instanceof LiveAuction_53)
                {
                    return $liveAuction;
                }
            }

            return 'falsche ID Live';
        }

        /**
         * @param $newLiveAuction
         * @return bool|\Plenty\Modules\Plugin\DataBase\Contracts\Model|string
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
         * @param $liveAuctionData
         * @return bool|string
         */
        public function updateLiveAuction($id, $liveAuctionData)
        {
            if ($liveAuctionData)
            {
                $liveAuction = $this -> getValue(LiveAuction_53::class, $id);

                if ($liveAuction instanceof LiveAuction_53)
                {
                    $liveAuction -> itemId = $liveAuctionData ['itemId'];
                    $liveAuction -> auctionId = $liveAuctionData ['auctionId'];

                    $liveAuction -> bidderList = $liveAuctionData ['bidderList'];

                    $liveAuction -> isEnded = $liveAuctionData ['isEnded'];
                    $liveAuction -> isLive = $liveAuctionData ['isLive'];
                    $liveAuction -> isEndedWithBuyNow = $liveAuctionData ['isEndedWithBuyNow'];

                    $this -> setValue($liveAuction);

                    return "ok, Live Auction Nr.: $id erfolgreich geändert!";
                }

                return 'Diese ID: ' + $id + ' ist uns nicht bekannt';
            }

            return false;

        }


        /**
         * @param $id
         * @return bool
         */
        public function deleteLiveAuction($id)
        {
            if ($id && $id > 0)
            {
                $liveAuctionModel = pluginApp(LiveAuction_53::class);
                $liveAuctionModel -> id = $id;

                return 'im Moment deaktiviert...';
//                return $this -> deleteValue($liveAuctionModel);
            }

            return false;
        }
    }