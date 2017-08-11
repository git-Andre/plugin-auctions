<?php

    namespace PluginAuctions\Controllers;

    use PluginAuctions\Services\Database\AuctionsService;
    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;

    class AuctionsController extends Controller {

        /**
         * @var AuctionsService
         */
        private $auctionsService;

        /**
         * AuctionsController constructor.
         * @param AuctionsService $auctionsService
         */
        public function __construct(AuctionsService $auctionsService)
        {
            $this -> auctionsService = $auctionsService;
        }


        /**
         * @param AuctionsRepositoryContract $auctionRepo
         * @return array
         */
        public function getAuctions() :  array
        {

            $auctions = ['hier', 'kommen', 'die Auktionen hin'];

            return $auctions;

        }

//        public function getAuction(int $id, AuctionsRepositoryContract $auctionRepo) : array
//        {
//            $getAuction = $auctionRepo -> getAuction($id);
//
//            return $getAuction;
//        }
//
//        /**
//         * @param  \Plenty\Plugin\Http\Request $request
//         * @param AuctionRepositoryContract $auctionRepo
//         * @return string
//         */
//        public function createAuction(Request $request, AuctionsRepositoryContract $auctionRepo) : string
//        {
//            $newAuction = $auctionRepo -> createAuction($request -> all());
//
//            return $newAuction;
//        }
//
//        /**
//         * @param int $id
//         * @param AuctionRepositoryContract $auctionRepo
//         * @return string
//         */
//        public function updateAuction(int $id, Request $request, AuctionsRepositoryContract $auctionRepo) : string
//        {
//            $updateAuction = $auctionRepo -> updateAuction($id, $request -> all());
//
//            return $updateAuction;
//        }

        /**
         */
        public function deleteAuction(Request $request)
        {

            $auctionId = $request -> get(all());

            if ($auctionId)
            {
                if ($this -> auctionsService -> deleteAuction($auctionId))
                {
                    return $this -> getAuctions();  // $this->deleteAuction();  // was soll wirklich zurück ???
                }
                return  'vom AuctionsService kam nichts';
            }
            return $request; //'keine auctionId';
        }

    }