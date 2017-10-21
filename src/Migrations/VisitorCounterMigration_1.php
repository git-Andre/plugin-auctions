<?php

    namespace PluginAuctions\Migrations;

    use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;
    use PluginAuctions\Models\VisitorCounter_1;

    /**
     * Class AuctionTableMigration_0_9
     * @package PluginAuctions\Migrations
     */
    class VisitorCounterMigration_1 {

        /**
         * @param Migrate $migrate
         */
        public function run(Migrate $migrate)
        {
            try
            {
                $migrate -> deleteTable(VisitorCounter_1::class);
            }
            catch ( \Exception $e )
            {
                echo $e -> getMessage();
            }
            $migrate -> createTable(VisitorCounter_1::class);

        }
    }