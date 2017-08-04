<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use Plenty\Plugin\Templates\Twig;
    use PluginAuctions\Contracts\AuctionsRepositoryContract;
    use PluginAuctions\Models\Auction_2;


    class PluginAuctionsController extends Controller {

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
         * @param Twig $twig
         * @param AuctionsRepositoryContract $auctionRepo
         * @return string
         */
        public function getAuctions(AuctionsRepositoryContract $auctionRepo) : array
        {
            $auctionList = $auctionRepo -> getAuctions();

            return $auctionList;

        }

        public function getAuction(int $id, AuctionsRepositoryContract $auctionRepo) : array
        {
            $getAuction[0] = $auctionRepo -> getAuction($id);

            return $getAuction[0];
        }

        /**
         * @param  \Plenty\Plugin\Http\Request $request
         * @param AuctionRepositoryContract $auctionRepo
         * @return string
         */
        public function createAuction(Request $request, AuctionsRepositoryContract $auctionRepo) : string
        {
            $newAuction = $auctionRepo -> createAuction($request -> all());

            return $newAuction;
        }

        /**
         * @param int $id
         * @param AuctionRepositoryContract $auctionRepo
         * @return string
         */
        public function updateAuction(int $id, Request $request, AuctionsRepositoryContract $auctionRepo) : string
        {
            $updateAuction = $auctionRepo -> updateAuction($id, $request -> all());

            return $updateAuction;
        }

        /**
         * @param int $id
         * @param AuctionRepositoryContract $auctionRepo
         * @return string
         */
        public function deleteAuction(int $id, AuctionsRepositoryContract $auctionRepo) : string
        {
            $deleteAuction = $auctionRepo -> deleteAuction($id);

            return $deleteAuction;
        }

        /**
         * @param Twig $twig
         * @return string
         */
        public function getHelloWorldPage(Twig $twig) : string
        {
            return $twig -> render('PluginAuctions::content/Auction');
        }

    }