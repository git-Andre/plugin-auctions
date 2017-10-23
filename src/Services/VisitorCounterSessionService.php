<?php

    namespace PluginAuctions\Services;

    use Plenty\Plugin\Log\Loggable;
    use Plenty\Plugin\SessionRepository;
    use PluginAuctions\Services\Database\VisitorCounterService;


    class VisitorCounterSessionService {

        use Loggable;

        private $visitorCounterService;

        private $sessionRepository;

        public function __construct(VisitorCounterService $visitorCounterService, SessionRepository $sessionRepository)
        {
            $this -> visitorCounterService = $visitorCounterService;
            $this -> sessionRepository = $sessionRepository;
        }

        public function getNumberOfVisitors(int $itemId) : int
        {
            $sessionItemArray = $this -> sessionRepository -> get("auctionSession");

            if (is_array($sessionItemArray))
            {
                if (in_array($itemId, $sessionItemArray))
                {
                    return $this -> visitorCounterService -> getNumberOfVisitorsForItemId($itemId);
                }
                else
                {
                    $sessionRepository -> push("auctionSession", $itemId);

                    return $this -> visitorCounterService -> increaseNumberOfVisitorsForItemId($itemId);
                }
            }
            else
            {
                $sessionRepository -> set("auctionSession", [$itemId]);

                return $this -> visitorCounterService -> increaseNumberOfVisitorsForItemId($itemId);

            }

            return - 1;
        }
    }
