<?php

    namespace PluginAuctions\Contracts;

    use PluginAuctions\Models\Auction_1_1;

    /**
     * Class AuctionsRepositoryContract
     * @package PluginAuctions\Contracts
     */
    interface AuctionsRepositoryContract {

        /**
         * List all tasks of the Auction list
         *
         * @return Auction[]
         */
        public function getAuctions() : array;

        /**
         * List an item of the Auction list
         *
         * @return Auction
         */
        public function getAuction($id) : Auction_1_1;

        /**
         * Add a new task to the Auction list
         *
         * @param array $data
         * @return Auction
         */

        public function createAuction(array $auctionData) : array;


        /**
         * Update the status of the Auction
         *
         * @param int $id
         * @return Auction
         */
        public function updateAuction($id, array $auctionData) : Auction_1_1;

        /**
         * Delete a task from the Auction list
         *
         * @param int $id
         * @return Auction
         */
        public function deleteAuction($id) : Auction_1_1;
    }
