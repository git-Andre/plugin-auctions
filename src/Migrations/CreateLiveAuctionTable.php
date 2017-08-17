<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\LiveAuction_3;


    /**
     * Class CreateAuction4Table
     */
    class CreateLiveAuctionTable {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try {
                $migrate -> deleteTable(LiveAuction_3::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
            $migrate -> createTable(LiveAuction_3::class);

        }
    }