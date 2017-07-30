<?php

    namespace PluginAuctions\Repositories;

    use Plenty\Exceptions\ValidationException;
    use Plenty\Modules\Frontend\Services\AccountService;
    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use PluginAuctions\Contracts\AuctionsRepositoryContract;
    use PluginAuctions\Models\Auction;
    use PluginAuctions\Validators\AuctionValidator;


    class AuctionRepository implements AuctionsRepositoryContract {

        /**
         * Add a new item to the To Do list
         *
         * @param array $data
         * @return Auction
         * @throws ValidationException
         */
        public function createTask(Auction $auctionVar) : Auction
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
            $auction = $auctionVar;

//            $auction -> itemId = $data -> itemId;
//            $auction -> startDate = $data -> startDate;
//            $auction -> startHour = $data -> startHour;
//            $auction -> startMinute = $data -> startMinute;
//            $auction -> auctionDuration = $data -> auctionDuration;
//            $auction -> startPrice = $data -> startPrice;
//            $auction -> buyNowPrice = $data -> buyNowPrice;

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
         * Update the status of the item
         *
         * @param int $id
         * @return Auction
         */
        public function updateTask($id) : Auction
        {
            /**
             * @var DataBase $database
             */
            $database = pluginApp(DataBase::class);

            $auctionList = $database -> query(Auction::class)
                -> where('id', '=', $id)
                -> get();

            $auction = $auctionList[0];
//            $auction -> isDone = true;
            $database -> save($auction);

            return $auction;
        }

        /**
         * Delete an item from the Auction list
         *
         * @param int $id
         * @return Auction
         */
        public function deleteTask($id) : Auction
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