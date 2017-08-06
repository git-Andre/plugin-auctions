<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\Auction_3;

    /**
     * Class CreateAuction3Table
     */
    class CreateAuction3Table {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try {
                $migrate -> createTable(Auction_3::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
        }
    }