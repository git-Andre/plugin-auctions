<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\Auction;
    use PluginAuctions\Models\Auction_1_1;

    /**
     * Class CreateAuctionTable
     */
    class CreateAuctionTable {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            $migrate -> createTable(Auction_1_1::class);

            $migrate -> deleteTable(Auction::class);
        }
    }