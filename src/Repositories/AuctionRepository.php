<?php

    namespace PluginAuctions\Repositories;

//    use Plenty\Exceptions\ValidationException;
//    use Plenty\Modules\Frontend\Services\AccountService;
    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use PluginAuctions\Contracts\AuctionsRepositoryContract;
    use PluginAuctions\Models\Auction;
//    use PluginAuctions\Validators\AuctionValidator;


    class AuctionRepository implements AuctionsRepositoryContract {

        /**
         * Add a new item to the Auction list
         *
         * @param array $data
         * @return Auction
         * @throws ValidationException
         */
        public function createAuction(array $auctionData) : Auction
        {
//        try {
//            AuctionValidator::validateOrFail($data);
//        } catch (ValidationException $e) {
//            throw $e;
//        }

            /**
             * @var DataBase $database
             */
            $database = pluginApp(DataBase::class);

            $auction = pluginApp(Auction::class);

            $auction -> itemId = $auctionData ['itemId'];
            $auction -> startDate = $auctionData ['startDate'];
            $auction -> startHour = $auctionData ['startHour'];
            $auction -> startMinute = $auctionData ['startMinute'];
            $auction -> auctionDuration = $auctionData ['auctionDuration'];
            $auction -> startPrice = $auctionData ['startPrice'];
            $auction -> buyNowPrice = $auctionData ['buyNowPrice'];

            $auction -> createdAt = time();

            $database -> save($auction);

            return $auction;
        }

        /**
         * Update the status of the item
         *
         * @param int $id
         * @return Auction
         */
        public function updateAuction($id, array $auctionData) : Auction
        {
            /**
             * @var DataBase $database
             */
            $database = pluginApp(DataBase::class);

            $auctionList = $database -> query(Auction::class)
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

            $auction -> createdAt = time();


            $database -> save($auction);

            return $auction;
        }

        /**
         * List all items of the Auction list
         *
         * @return Auction[]
         */
        public function getAuctions() : array
        {
            $database = pluginApp(DataBase::class);

//        $id = $this->getCurrentContactId();
            /**
             * @var Auction[] $auctionList
             */
            $auctionList = $database -> query(Auction::class) -> get();

            return $auctionList;
        }

        /**
         * List an item of the Auction list
         *
         * @return Auction[]
         */
        public function getAuction($id) : Auction
        {
            /**
             * @var DataBase $database
             */
            $database = pluginApp(DataBase::class);

            $auctionList = $database -> query(Auction::class)
                -> where('id', '=', $id)
                -> get();

            $auction = $auctionList[0];

            return $auction;
        }

        /**
         * Delete an item from the Auction list
         *
         * @param int $id
         * @return Auction
         */
        public function deleteAuction($id) : Auction
        {
            /**
             * @var DataBase $database
             */
            $database = pluginApp(DataBase::class);

            $auctionList = $database -> query(Auction::class)
                -> where('id', '=', $id)
                -> get();

            $auction = $auctionList[0];
            $database -> delete($auction);

            return $auction;
        }
    }