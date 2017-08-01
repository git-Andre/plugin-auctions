<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\Auction_1_1;

    /**
     * Class CreateAuctionTable
     */
    class CreateAuction11Table {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
//            $migrate -> createTable(Auction_1_1::class);

            try {
                $migrate -> createTable(Auction_1_1::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
//            $migrate -> deleteTable(Auction::class);
        }
    }