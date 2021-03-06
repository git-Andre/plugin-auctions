<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use PluginAuctions\Services\Database\AuctionsService;

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
         * @return array|bool
         */
        public function getAuctions()
        {
            return $this -> auctionsService -> getAuctions();
        }
        /**
         * @return array|bool
         */
        public function getAuctionsHelper()
        {
            return $this -> auctionsService -> getAuctionsHelper();
        }

        /**
         * @param $id
         * @return string
         */
        public function getAuction($id)
        {
            if ($id && $id > 0)
            {
                return json_encode($this -> auctionsService -> getAuction($id));
            }

            return 'keine ID (oder 0)';
        }

        public function getBidderList($id)
        {
            if ($id && $id > 0)
            {
                return json_encode($this -> auctionsService -> getBidderList($id));
            }

            return 'keine ID (oder 0)';
        }

        /**
         * @param $id
         * @return string
         */
        public function getCurrentBidPrice($id)
        {
            if ($id && $id > 0)
            {
                return json_encode($this -> auctionsService -> getCurrentBidPrice($id));
            }

            return 'keine ID (oder 0)';
        }

        public function getAuctionForItemId($itemId)
        {
            if ($itemId && $itemId > 0)
            {
                return json_encode($this -> auctionsService -> getAuctionForItemId($itemId));
            }

            return 'keine ID (oder 0) - getLiveAuctionForItemId';
        }

        /**
         * @param Request $request
         * @return bool|string
         */
        public function createAuction(Request $request)
        {
            $newBackendAuction = $request -> all();

            if ($newBackendAuction)
            {
                $result = $this -> auctionsService -> createAuction($newBackendAuction);

                if ($result)
                {
                    return json_encode($result);
                }

                return false;
            }

            return 'Fehler beim Request createAuction';
        }

        /**
         * @param int $id
         * @param Request $request
         * @return string
         */
        public function updateAuction(int $id, Request $request)
        {
            $auctionData = $request -> all();

            return $this -> auctionsService -> updateAuction($id, $auctionData);
        }

        /**
         * @param int $id
         * @param Request $request
         * @return string
         */
        public function updateBidderlist(int $id, Request $request)
        {
            $sendedBid = $request -> all();
            return $this -> auctionsService -> updateBidderList($id, $sendedBid);
        }

        /**
         * @param $id
         * @return bool|string
         */
        public function deleteAuction($id)
        {
            if ($id)
            {
                return $this -> auctionsService -> deleteAuction($id);
            }

            return $id;
        }

        /**
         * helper
         * @param $time
         * @return false|string
         */
        public function formatDate($time)
        {
            return json_encode(date('d.m.Y H:i:s e', $time));
        }

        /**
         * @return AuctionsService
         */
        public function calculateTense($start, $end) : string
        {
            return $this -> auctionsService ->calculateTense($start, $end);
        }
    }
