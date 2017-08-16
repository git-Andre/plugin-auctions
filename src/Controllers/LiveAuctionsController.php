<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use PluginAuctions\Services\Database\LiveAuctionsService;

    class LiveAuctionsController extends Controller {

        /**
         * @var AuctionsService
         */
        private $liveAuctionsService;

        /**
         * AuctionsController constructor.
         * @param AuctionsService $liveAuctionsService
         */
        public function __construct(LiveAuctionsService $liveAuctionsService)
        {
            $this -> liveAuctionsService = $liveAuctionsService;
        }


        /**
         * @return array|bool
         */
        public function getAuctions()
        {
            return $this -> liveAuctionsService -> getAuctions();
        }

        /**
         * @param int $auctionId
         * @return bool|mixed|string
         */
        public function getAuction($id)
        {
            if ($id && $id > 0)
            {
                return json_encode($this -> liveAuctionsService -> getAuction($id));
            }
            return 'keine ID (oder 0)';
        }

        /**
         * @param Request $request
         * @return string
         */
        public function createAuction(Request $request)
        {
            $newLiveAuction = $request -> all();

            if ($newLiveAuction)
            {
                if ($this -> liveAuctionsService -> createAuction($newLiveAuction))
                {
                    return 'ok';
                }
            }

            return 'Fehler beim Request';
        }

        /**
         * @param Request $request
         * @return \PluginAuctions\Services\Database\Auction[]
         */
        public function updateAuction(int $id, Request $request)
        {
            $auctionData = $request -> all();

            return $this -> liveAuctionsService -> updateAuction($id, $auctionData);
        }

        /**
         * @param $auctionId
         * @return string
         */
        public function deleteAuction($id)
        {

            if ($id)
            {
                if ($this -> liveAuctionsService -> deleteAuction($id))
                {
                    return 'ok';  //$this -> getAuctions();  // was soll wirklich zurück ???
                }

                return 'vom LiveAuctionsService kam nichts';
            }

            return 'keine Id';
        }

    }