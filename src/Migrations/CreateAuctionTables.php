<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\Auction_4;
    use PluginAuctions\Models\LiveAuction_1;


    /**
     * Class CreateAuction4Table
     */
    class CreateAuctionTables {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try {
                $migrate -> deleteTable(Auction_4::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
            $migrate -> createTable(Auction_4::class);


            try {
                $migrate -> deleteTable(LiveAuction_1::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
            $migrate -> createTable(LiveAuction_1::class);

        }
    }