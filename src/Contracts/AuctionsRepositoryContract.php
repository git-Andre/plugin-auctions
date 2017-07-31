<?php

namespace PluginAuctions\Contracts;

use PluginAuctions\Models\Auction;

/**
 * Class AuctionsRepositoryContract
 * @package PluginAuctions\Contracts
 */
interface AuctionsRepositoryContract
{

    /**
     * List all tasks of the Auction list
     *
     * @return Auction[]
     */
    public function getAuctions(): array;

    /**
     * List an item of the Auction list
     *
     * @return Auction
     */
    public function getAuction($id): Auction;
    /**
     * Add a new task to the Auction list
     *
     * @param array $data
     * @return Auction
     */

    public function createAuction(array $auctionData): Auction;


    /**
     * Update the status of the Auction
     *
     * @param int $id
     * @return Auction
     */
    public function updateAuction($id, array $auctionData): Auction;

    /**
     * Delete a task from the Auction list
     *
     * @param int $id
     * @return Auction
     */
    public function deleteAuction($id): Auction;
}
