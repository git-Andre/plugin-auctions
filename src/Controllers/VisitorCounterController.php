<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use Plenty\Plugin\Log\Loggable;

    use PluginAuctions\Services\Database\VisitorCounterService;

    // TODO Response ohne json_encode????

    class VisitorCounterController extends Controller {
        // VisitorCounter = Class / numberOfVisitors = int number of visitors

        use Loggable;

        private $visitorCounterService;

        public function __construct(VisitorCounterService $visitorCounterService)
        {
            $this -> visitorCounterService = $visitorCounterService;
        }

        /**
         * @param int $itemId
         * @return int
         */
        public function getNumberOfVisitorsForItemId($itemId = 0)
        {
            if ($itemId > 0)
            {
                return $this -> visitorCounterService -> getNumberOfVisitorsForItemId($itemId);
            }
            return -3;
        }

        /**
         * @param Request $request
         * @return int
         */
        public function increaseNumberOfVisitorsForItemId(Request $request) : int
        {
            $itemId = $request -> get('itemId', 0);

            if ($itemId > 0)
            {
                return $this -> visitorCounterService -> increaseNumberOfVisitorsForItemId($itemId);
            }
            return -3;
        }

        /**
         * @param int $id
         * @return int
         */
        public function deleteVisitorCounter($id = 0) : int
        {
            if ($id > 0)
            {
                return $this -> visitorCounterService -> deleteVisitorCounter($id);
            }
            return false;
        }

        /**
         * get Class VisitorCounter
         * @param $itemId
         * @return string
         */
        public function getVisitorCounterForItemId($itemId)
        {
            if ($itemId && $itemId > 0)
            {
                return json_encode($this -> visitorCounterService -> getVisitorCounterForItemId($itemId));
            }
            return 'keine ID (oder 0) - getLiveAuctionForItemId';
        }

        /**
         * @return string
         */
        public function getVisitorCounters()
        {
                return json_encode($this -> visitorCounterService -> getVisitorCounters());
        }

//        /**
//         * @param Request $request
//         * @return string
//         */
//        public function createVisitorCounter(Request $request)
//        {
//            $itemId = $request -> get('itemId', 0);
//
//            if ($itemId > 0)
//            {
//                return $this -> visitorCounterService -> createVisitorCounter($itemId);
//            }
//            return 'Fehler beim Request getVisitorCounterForItemId';
//        }

//        public function updateAuction(int $id, Request $request)
//        {
//            $auctionData = $request -> all();
//
//            return $this -> auctionsService -> updateAuction($id, $auctionData);
//        }
    }
