<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\LiveAuction_53;


    /**
     * Class CreateAuction4Table
     */
    class CreateLiveAuctionTable53 {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try {
                $migrate -> deleteTable(LiveAuction_53::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
            $migrate -> createTable(LiveAuction_53::class);

        }
    }