<?php

    namespace PluginAuctions\Repositories;

//    use Plenty\Exceptions\ValidationException;
//    use Plenty\Modules\Frontend\Services\AccountService;
    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use Plenty\Plugin\Templates\Twig;
    use PluginAuctions\Contracts\AuctionsRepositoryContract;
    use PluginAuctions\Models\Auction_2;

    //    use PluginAuctions\Validators\AuctionValidator;


    class AuctionRepository implements AuctionsRepositoryContract {

        /**
         * List all items of the Auction list
         *
         * @return Auction[]
         */
        public function getAuctions() : array
        {

            $database = pluginApp(DataBase::class);

            /**
             * @var Auction[] $auctionList
             */
            $auctionList = $database
                -> query(Auction_2::class)
                -> get();

            return $auctionList;
        }

        /**
         * List an item of the Auction list
         *
         * @return Auction[]
         */
        public function getAuction($id) : Auction_2
        {
            /**
             * @var DataBase $database
             */
            $database = pluginApp(DataBase::class);

            $auctionList = $database -> query(Auction_2::class)
                -> where('id', '=', $id)
                -> get();

            $auction = $auctionList[0];

            return $auction;
        }


        /**
         * Add a new item to the Auction list
         *
         * @param array $data
         * @return Auction
         * @throws ValidationException ToDo:
         */
        public function createAuction(array $auctionData) : string
        {
            /**
             * @var DataBase $database
             */
            $database = pluginApp(DataBase::class);

            $auction = pluginApp(Auction_2::class);

            $auction -> itemId = $auctionData ['itemId'];
            $auction -> startDate = $auctionData ['startDate'];
            $auction -> startHour = $auctionData ['startHour'];
            $auction -> startMinute = $auctionData ['startMinute'];
            $auction -> auctionDuration = $auctionData ['auctionDuration'];
            $auction -> startPrice = $auctionData ['startPrice'];
            $auction -> buyNowPrice = $auctionData ['buyNowPrice'];

            $auction -> createdAt = time();
            $auction -> updatedAt = $auction -> createdAt;


            try {
                $database -> save($auction);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();

                return json_encode($auction);
            }

            return "Auction erfolgreich angelegt!";
        }

        /**
         * Update the status of the item
         *
         * @param int $id
         * @return Auction
         */
        public function updateAuction($id, array $auctionData) : string
        {

            /**
             * @var DataBase $database
             */
            $database = pluginApp(DataBase::class);
            $auction = pluginApp(Auction_2::class);


            $auctionList = $database -> query(Auction_2::class)
                -> where('id', '=', $id)
                -> get();

            $auction = $auctionList[0];

            $auction -> itemId = $auctionData ['itemId'];
            $auction -> startDate = $auctionData ['startDate'];
            $auction -> startHour = $auctionData ['startHour'];
            $auction -> startMinute = $auctionData ['startMinute'];
            $auction -> auctionDuration = $auctionData ['auctionDuration'];
            $auction -> startPrice = $auctionData ['startPrice'];
            $auction -> buyNowPrice = $auctionData ['buyNowPrice'];

            $auction -> updatedAt = time();


            try {
                $database -> save($auction);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();

                return json_encode($auction);
            }
//            $auction = $database -> find(Auction_2::class, $id);

//            return json_encode($auction);
            return "Auction Nr.: $id erfolgreich geändert!";
        }


        /**
         * Delete an item from the Auction list
         *
         * @param int $id
         * @return Auction
         */
        public function deleteAuction($id) : string
        {
            /**
             * @var DataBase $database
             */
            $database = pluginApp(DataBase::class);

            $auctionList = $database -> query(Auction_2::class)
                -> where('id', '=', $id)
                -> get();

            $auction = $auctionList[0];

            try {
                $del = $database -> delete($auction);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();

                return json_encode($auction);
            }

            return "Auction Nr.: $id erfolgreich gelöscht! ($del)";
        }
    }