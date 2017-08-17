<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\LiveAuction_5;


    /**
     * Class CreateAuction4Table
     */
    class CreateLiveAuctions {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try {
                $migrate -> deleteTable(LiveAuction_5::class);
            } catch ( \Exception $e ) {
                echo $e -> getMessage();
            }
            $migrate -> createTable(LiveAuction_5::class);

        }
    }