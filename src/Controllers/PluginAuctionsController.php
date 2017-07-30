<?php

namespace PluginAuctions\Controllers;

use Plenty\Plugin\Controller;
use Plenty\Plugin\Http\Request;
use Plenty\Plugin\Templates\Twig;
use PluginAuctions\Contracts\AuctionsRepositoryContract;
use PluginAuctions\Models\Auction;
use PluginAuctions\Services\AuctionsService;

class PluginAuctionsController extends Controller
{

    /**
     * @var AuctionsService
     */
//    private $auctionsService;
//
//    public function __construct(AuctionsService $auctionsService)
//    {
//        $this->auctionsService = $auctionsService;
//    }


    /**
     * @param Twig                   $twig
     * @param AuctionsRepositoryContract $auctionRepo
     * @return string
     */
    public function getAuctions(AuctionsRepositoryContract $auctionRepo): array {
        $auctionList = $auctionRepo->getAuctions();
        return $auctionList;

    }

    /**
     * @param  \Plenty\Plugin\Http\Request $request
     * @param AuctionRepositoryContract       $auctionRepo
     * @return string
     */
    public function createAuction(Request $request, AuctionsRepositoryContract $auctionRepo): string
    {
        $newAuction = $auctionRepo->createAuction($request->all());
        return json_encode($newAuction);
    }

    /**
     * @param int                    $id
     * @param AuctionRepositoryContract $auctionRepo
     * @return string
     */
    public function updateAuction(int $id, AuctionsRepositoryContract $auctionRepo): string
    {
        $updateAuction = $auctionRepo->updateAuction($id);
        return json_encode($updateAuction);
    }

    /**
     * @param int                    $id
     * @param AuctionRepositoryContract $auctionRepo
     * @return string
     */
    public function deleteAuction(int $id, AuctionsRepositoryContract $auctionRepo): string
    {
        $deleteAuction = $auctionRepo->deleteAuction($id);
        return json_encode($deleteAuction);
    }
    /**
     * @param Twig $twig
     * @return string
     */
    public function getHelloWorldPage(Twig $twig):string
    {
        return $twig->render('PluginAuctions::Index');
    }

}