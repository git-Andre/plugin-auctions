<?php

namespace PluginAuctions\Migrations;

use PluginAuctions\Models\Auction;
use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;

/**
 * Class CreateAuctionTable
 */
class CreateAuctionTable
{
    /**
     * @param Migrate $migrate
     */
    public function run(Migrate $migrate)
    {
        $migrate->createTable(Auction::class);
    }
}