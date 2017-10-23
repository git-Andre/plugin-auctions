<?php

    namespace PluginAuctions\Services;

    use Plenty\Plugin\Log\Loggable;
    use Plenty\Plugin\SessionRepository;
    use PluginAuctions\Services\Database\AuctionsService;
    use PluginAuctions\Services\Database\VisitorCounterService;
    use PluginAuctions\Constants\AuctionStatus;


    class VisitorCounterSessionService {

        use Loggable;

        private $visitorCounterService;

        private $sessionRepository;
        private $auctionsService;

        public function __construct(VisitorCounterService $visitorCounterService, SessionRepository $sessionRepository, AuctionsService $auctionsService)
        {
            $this -> visitorCounterService = $visitorCounterService;
            $this -> sessionRepository = $sessionRepository;
            $this -> auctionsService = $auctionsService;
        }

        public function getNumberOfVisitors(int $itemId) : int
        {
            $sessionItemArray = $this -> sessionRepository -> get("auctionSession");
            $auction = $this -> auctionsService -> getAuctionForItemId($itemId);

            if (is_array($sessionItemArray) && $auction['tense'] == AuctionStatus::PRESENT)
            {
                if (in_array($itemId, $sessionItemArray))
                {
                    return $this -> visitorCounterService -> getNumberOfVisitorsForItemId($itemId);
                }
                else
                {
                    $this -> sessionRepository -> push("auctionSession", $itemId);

                    return $this -> visitorCounterService -> increaseNumberOfVisitorsForItemId($itemId);
                }
            }
            elseif ($auction['tense'] == AuctionStatus::PRESENT)
            {
                $this -> sessionRepository -> set("auctionSession", [$itemId]);

                return $this -> visitorCounterService -> increaseNumberOfVisitorsForItemId($itemId);

            }

            return $this -> visitorCounterService -> getNumberOfVisitorsForItemId($itemId);
        }
    }
