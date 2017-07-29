<?php

namespace PluginAuctions\Controllers;

use Plenty\Plugin\Controller;
use Plenty\Plugin\Http\Request;
use Plenty\Plugin\Templates\Twig;
use PluginAuctions\Contracts\AuctionsRepositoryContract;

class PluginAuctionsController extends Controller
{
    /**
     * @param Twig $twig
     * @return string
     */
    public function getHelloWorldPage(Twig $twig):string
    {
        return $twig->render('PluginAuctions::Index');
    }
    /**
     * @param Twig                   $twig
     * @param AuctionsRepositoryContract $auctionRepo
     * @return string
     */
    public function showAuction(Twig $twig, AuctionsRepositoryContract $auctionRepo): string
    {
        $auctionList = $auctionRepo->getAuctions();
        $templateData = array("tasks" => $auctionList);
        return $twig->render('PluginAuctions::content.auction', $templateData);
    }

    /**
     * @param  \Plenty\Plugin\Http\Request $request
     * @param AuctionRepositoryContract       $auctionRepo
     * @return string
     */
    public function createAuction(Request $request, AuctionsRepositoryContract $auctionRepo): string
    {
        $newAuction = $auctionRepo->createTask($request->all());
        return json_encode($newAuction);
    }

    /**
     * @param int                    $id
     * @param AuctionRepositoryContract $auctionRepo
     * @return string
     */
    public function updateAuction(int $id, AuctionsRepositoryContract $auctionRepo): string
    {
        $updateAuction = $auctionRepo->updateTask($id);
        return json_encode($updateAuction);
    }

    /**
     * @param int                    $id
     * @param AuctionRepositoryContract $auctionRepo
     * @return string
     */
    public function deleteAuction(int $id, AuctionsRepositoryContract $auctionRepo): string
    {
        $deleteAuction = $auctionRepo->deleteTask($id);
        return json_encode($deleteAuction);
    }

}