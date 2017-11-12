<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use Plenty\Plugin\Log\Loggable;

    use PluginAuctions\Services\Database\AuctionsService;

    // TODO Response ohne json_encode????

    class AuctionsController extends Controller {

        use Loggable;

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
            return json_encode($this -> auctionsService -> getAuctions());
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
        public function getAuction($id = 0)
        {
            if ($id && $id > 0)
            {
                return $this -> auctionsService -> getAuction($id);
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

        public function getBidderListLastEntry($id)
        {
            if ($id && $id > 0)
            {
                return json_encode($this -> auctionsService -> getBidderListLastEntry($id));
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

            return json_encode('keine ID (oder 0) - getLiveAuctionForItemId');
        }

        public function getAuctionParamsListForCategoryItem(Request $request)
        {
            $itemIds = (array) $request -> get('itemIds');

            if (is_array($itemIds) && count($itemIds) > 0)
            {
                return json_encode($this -> auctionsService -> getAuctionParamsListForCategoryItem($itemIds));
            }

            return json_encode('keine itemIds - getAuctionParamsListForCategoryItem');
        }

        public function getAuctionForItemIdAndTense(Request $request)
        {
            $itemId = (int) $request -> get('itemId');
            $tense =  $request -> get('tense');


            $this -> getLogger(__METHOD__)
                  -> debug('PluginAuctions::auctions.debug', ['$itemId: ' => $itemId], ['$tense: ' => $tense]);

            if ($itemId > 0)
            {
                return json_encode($this -> auctionsService -> getAuctionForItemIdAndTense($itemId, $tense));
            }

            return false;
        }

        public function getAuctionsForTense(Request $request)
        {
            $tense = (string) $request -> get('tense');
            if ($tense)
            {
                return json_encode($this -> auctionsService -> getAuctionsForTense($tense));
            }
            return 'keine tense angegeben - getAuctionsForTense';
        }

        public function getAuctionsInPast()
        {
                return json_encode($this -> auctionsService -> getAuctionsInPast());
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

        public function updateAuctionWithTense(int $auctionId, Request $request)
        {
            $tense = $request -> get('tense');

            return $this -> auctionsService -> updateAuctionWithTense($auctionId, $tense);
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
        public function deleteAuction(int $id)
        {
            $this -> getLogger(__METHOD__)
                  -> debug('PluginAuctions::auctions.debug', [' (auctionId): ' => $id]);


//            $id = (int)$request -> get ('auctionId');
            if ($id > 0)
            {
                return $this -> auctionsService -> deleteAuction($id);
            }

            return $id;
        }

//        /**
//         * @param $id
//         * @return bool|string
//         */
//        public function deleteAuction($id)
//        {
//            if ($id)
//            {
//                return $this -> auctionsService -> deleteAuction($id);
//            }
//
//            return $id;
//        }
//
//        /**
//         * helper
//         * @param $time
//         * @return false|string
//         */
        public function formatDate($time)
        {
            return json_encode(date('d.m.Y H:i:s e', $time));
        }

        /**
         * @return AuctionsService
         */
        public function calculateTense($start, $end) : string
        {
            return json_encode($this -> auctionsService -> calculateTense($start, $end));
        }
    }
