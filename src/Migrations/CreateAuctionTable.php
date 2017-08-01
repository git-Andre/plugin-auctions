<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\Auction_2;

    /**
     * Class CreateAuctionTable
     */
    class CreateAuctionTable {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try {
                $migrate -> createTable(Auction_2::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
        }
    }