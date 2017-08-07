<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\Auction_4;

    /**
     * Class CreateAuction4Table
     */
    class CreateAuction4Table {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try {
                $migrate -> createTable(Auction_4::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
        }
    }