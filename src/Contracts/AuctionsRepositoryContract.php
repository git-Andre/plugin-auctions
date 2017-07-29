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
     * Add a new task to the Auction list
     *
     * @param array $data
     * @return Auction
     */
    public function createTask(array $data): Auction;

    /**
     * List all tasks of the Auction list
     *
     * @return Auction[]
     */
    public function getAuctions(): array;

    /**
     * Update the status of the task
     *
     * @param int $id
     * @return Auction
     */
    public function updateTask($id): Auction;

    /**
     * Delete a task from the Auction list
     *
     * @param int $id
     * @return Auction
     */
    public function deleteTask($id): Auction;
}
