<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\LiveAuction_53;
    use PluginAuctions\Models\Auction_6;

    /**
     * Class CreateAuction_5
     */
    class AuctionTableMigration_0_6 {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try
            {
                $migrate -> deleteTable(LiveAuction_53::class);
            }
            catch ( \Exception $e )
            {
                echo $e -> getMessage();
            }

            try
            {
                $migrate -> deleteTable(Auction_6::class);
            }
            catch ( \Exception $e )
            {
                echo $e -> getMessage();
            }
            $migrate -> createTable(Auction_6::class);

        }
    }