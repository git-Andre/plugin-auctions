<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use Plenty\Plugin\Log\Loggable;

    use PluginAuctions\Services\Database\VisitorCounterService;

    // TODO Response ohne json_encode????

    class VisitorCounterController extends Controller {

        use Loggable;

        /**
         * @var AuctionsService
         */
        private $visitorCounterService;

        /**
         * AuctionsController constructor.
         * @param AuctionsService $auctionsService
         */
        public function __construct(VisitorCounterService $visitorCounterService)
        {
            $this -> visitorCounterService = $visitorCounterService;
        }

        public function getCounterForItemId($itemId = 0)
        {
            if ($itemId && $itemId > 0)
            {
                return $this -> visitorCounterService -> getCounterForItemId($itemId);
            }
            return 'keine ID (oder 0)';
        }

        public function getVisitorCounterForItemId($itemId)
        {
            if ($itemId && $itemId > 0)
            {
                return json_encode($this -> visitorCounterService -> getAuctionForItemId($itemId));
            }
            return 'keine ID (oder 0) - getLiveAuctionForItemId';
        }
        public function createVisitorCounter(Request $request)
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

//        public function updateAuction(int $id, Request $request)
//        {
//            $auctionData = $request -> all();
//
//            return $this -> auctionsService -> updateAuction($id, $auctionData);
//        }
    }
