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
         * List all items of the Auction list
         *
         * @return Auction[]
         */
//        public function getAuctions() : array
//        {
//
//            $database = pluginApp(DataBase::class);
//
//            /**
//             * @var Auction[] $auctionList
//             */
//            $auctionList = $database
//                -> query(Auction_4::class)
//                -> get();
//
//            return $auctionList;
//        }
//
//        /**
//         * List an item of the Auction list
//         *
//         * @return Auction[]
//         */
//        public function getAuction($id) : array
//        {
//            /**
//             * @var DataBase $database
//             */
//            $database = pluginApp(DataBase::class);
//
//            $auctionList = $database -> query(Auction_4::class)
//                -> where('id', '=', $id)
//                -> get();
//
////            $auction = $auctionList[0];
//
//            return $auctionList;
//        }
//
//
//        /**
//         * Add a new item to the Auction list
//         *
//         * @param array $data
//         * @return Auction
//         * @throws ValidationException ToDo:
//         */
//        public function createAuction(array $auctionData) : string
//        {
//            /**
//             * @var DataBase $database
//             */
//            $database = pluginApp(DataBase::class);
//
//            $auction = pluginApp(Auction_4::class);
//
//            $auction -> itemId = $auctionData ['itemId'];
//            $auction -> startDate = $auctionData ['startDate'];
//            $auction -> startHour = $auctionData ['startHour'];
//            $auction -> startMinute = $auctionData ['startMinute'];
//            $auction -> auctionDuration = $auctionData ['auctionDuration'];
//            $auction -> startPrice = $auctionData ['startPrice'];
//            $auction -> buyNowPrice = $auctionData ['buyNowPrice'];
//
//            $auction -> createdAt = time();
//            $auction -> updatedAt = $auction -> createdAt;
//
//
//            try {
//                $database -> save($auction);
//            } catch ( \Exception $e ) {
//                echo $e -> getMessage();
//
//                return json_encode($auction);
//            }
//
//            return "Auction erfolgreich angelegt!";
//        }
//
//        /**
//         * Update the status of the item
//         *
//         * @param int $id
//         * @return Auction
//         */
        public function updateAuction(int $id, Request $request)
        {//
//            $auction = pluginApp(Auction_4::class);
//            $auction = $updateAuction;

            $auctionData = $request -> all();

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
                return json_encode($auction);
            }

            return 'keine richtigen Daten'; // "Auction Nr.: $id erfolgreich geändert!";
        }


        /**
         * Delete an item from the Auction list
         *
         * @param int $id
         * @return bool | null
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