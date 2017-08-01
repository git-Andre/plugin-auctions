<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\Auction__12;

    /**
     * Class CreateAuctionTable
     */
    class CreateAuction11Table {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try {
                $migrate -> createTable(Auction__12::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
        }
    }