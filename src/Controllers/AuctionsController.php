<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use PluginAuctions\Services\Database\AuctionsService;
    use PluginAuctions\Services\Database\LiveAuctionsService;

    class AuctionsController extends Controller {

        /**
         * @var AuctionsService
         */
        private $auctionsService;

        /**
         * @var LiveAuctionsService
         */
        private $liveAuctionsService;


        /**
         * AuctionsController constructor.
         * @param AuctionsService $auctionsService
         */
        public function __construct(AuctionsService $auctionsService, LiveAuctionsService $liveAuctionsService)
        {
            $this -> auctionsService = $auctionsService;
            $this -> liveAuctionsService = $liveAuctionsService;
        }


        /**
         * @return array|bool
         */
        public function getAuctions()
        {
            return $this -> auctionsService -> getAuctions();
        }

        /**
         * @param int $auctionId
         * @return bool|mixed|string
         */
        public function getAuction($id)
        {
            if ($id && $id > 0)
            {
                return json_encode($this -> auctionsService -> getAuction($id));
            }
            return 'keine ID (oder 0)';
        }

        /**
         * @param Request $request
         * @return string
         */
        public function createAuction(Request $request)
        {
            $newAuction = $request -> all();

            if ($newAuction)
            {
                if ($this -> auctionsService -> createAuction($newAuction))
                {
                    return 'ok von createAuction';
                }
            }

            return 'Fehler beim Request createAuction';
        }

        /**
         * @param Request $request
         * @return \PluginAuctions\Services\Database\Auction[]
         */
        public function updateAuction(int $id, Request $request)
        {
            $auctionData = $request -> all();

            return $this -> auctionsService -> updateAuction($id, $auctionData);
        }

        /**
         * @param $auctionId
         * @return string
         */
        public function deleteAuction($id)
        {

            if ($id)
            {
                if ($this -> auctionsService -> deleteAuction($id))
                {
                    return 'ok vom auctionsService';  //$this -> getAuctions();  // was soll wirklich zurück ???
                }

                return 'vom AuctionsService kam nichts';
            }

            return 'keine Id';
        }

//        ###################

        /**
         * @return array|bool
         */
        public function getLiveAuctions()
        {
//            return 'Hallo André';
//            return json_encode('hallo meen Kleener...');
            return $this -> liveAuctionsService -> getLiveAuctions();
        }

        /**
         * @param int $auctionId
         * @return bool|mixed|string
         */
        public function getLiveAuction($id)
        {
            if ($id && $id > 0)
            {
                return json_encode($this -> liveAuctionsService -> getLiveAuction($id));
            }
            return 'keine ID (oder 0)';
        }

        /**
         * @param Request $request
         * @return array|string
         */
        public function createLiveAuction(Request $request)
        {
            $newLiveAuction = $request -> all();

            if ($newLiveAuction)
            {
                if ($this -> liveAuctionsService -> createLiveAuction($newLiveAuction))
                {
//                    return 'ok createLiveAuction';
                    return $newLiveAuction;
                }
            }

            return 'Fehler beim Request';
        }

        /**
         * @param int $id
         * @param Request $request
         * @return string
         */
        public function updateLiveAuction(int $id, Request $request)
        {
            $auctionData = $request -> all();

            return $this -> liveAuctionsService -> updateLiveAuction($id, $auctionData);
        }

        /**
         * @param $id
         * @return string
         */
        public function deleteLiveAuction($id)
        {

            if ($id)
            {
                if ($this -> liveAuctionsService -> deleteLiveAuction($id))
                {
                    return 'ok vom LiveAuction Delete';
                }

                return 'vom LiveAuctionsService Delete kam nichts';
            }

            return 'keine Id';
        }

    }
