<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\LiveAuction_53;
    use PluginAuctions\Models\Auction_7;

    /**
     * Class CreateAuction_5
     */
    class AuctionTableMigration_0_8 {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try
            {
                $migrate -> deleteTable(Auction_7::class);
            }
            catch ( \Exception $e )
            {
                echo $e -> getMessage();
            }
            $migrate -> createTable(Auction_7::class);

        }
    }