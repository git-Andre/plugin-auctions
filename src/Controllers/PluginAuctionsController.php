<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use PluginAuctions\Contracts\AuctionsRepositoryContract;
    use Plenty\Plugin\Http\Request;

    class PluginAuctionsController extends Controller {

        /**
         * @var AuctionsService
         */
        private $auctionsService;

        public function __construct(AuctionsService $auctionsService)
        {
            $this -> auctionsService = $auctionsService;
        }


        /**
         * @param AuctionsRepositoryContract $auctionRepo
         * @return array
         */
        public function getAuctions(AuctionsRepositoryContract $auctionRepo) : array
        {
            $auctionList = $auctionRepo -> getAuctions();

            return $auctionList;

        }

        public function getAuction(int $id, AuctionsRepositoryContract $auctionRepo) : array
        {
            $getAuction = $auctionRepo -> getAuction($id);

            return $getAuction;
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

    }