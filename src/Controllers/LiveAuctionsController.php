<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use PluginAuctions\Services\Database\LiveAuctionsService;

    class LiveAuctionsController extends Controller {

        /**
         * @var LiveAuctionsService
         */
        private $liveAuctionsService;

        /**
         * LiveAuctionsController constructor.
         * @param LiveAuctionsService $liveAuctionsService
         */
        public function __construct(LiveAuctionsService $liveAuctionsService)
        {
            $this -> liveAuctionsService = $liveAuctionsService;
        }


        /**
         * @return array|bool
         */
        public function getLiveAuctions()
        {
//            return 'Hallo André';
//            return json_encode('hallo meen Kleener...');
            return $this -> liveAuctionsService -> getLiveAuctions();
        }

//        /**
//         * @param int $auctionId
//         * @return bool|mixed|string
//         */
//        public function getAuction($id)
//        {
//            if ($id && $id > 0)
//            {
//                return json_encode($this -> liveAuctionsService -> getAuction($id));
//            }
//            return 'keine ID (oder 0)';
//        }
//
        /**
         * @param Request $request
         * @return string
         */
        public function createLiveAuction(Request $request)
        {
            $newLiveAuction = $request -> all();

            if ($newLiveAuction)
            {
                if ($this -> liveAuctionsService -> createLiveAuction($newLiveAuction))
                {
//                    return 'ok';
                    return $newLiveAuction;
                }
            }

            return 'Fehler beim Request';
        }

        /**
         * @param int $id
         * @param Request $request
         * @return mixed
         */
        public function updateLiveAuction(int $id, Request $request)
        {
            $auctionData = $request -> all();

            return $this -> liveAuctionsService -> updateLiveAuction($id, $auctionData);
        }

        /**
         * @param $auctionId
         * @return string
         */
        public function deleteLiveAuction($id)
        {

            if ($id)
            {
                if ($this -> liveAuctionsService -> deleteLiveAuction($id))
                {
//                    return 'ok';
                    $this -> getAuctions();  // was soll wirklich zurück ???
                }

                return 'vom LiveAuctionsService kam nichts';
            }

            return 'keine Id';
        }

    }