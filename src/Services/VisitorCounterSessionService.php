<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Log\Loggable;
    use Plenty\Plugin\SessionRepository;
    use PluginAuctions\Services\Database\VisitorCounterService;


    class VisitorCounterSessionService {

        use Loggable;

        private $visitorCounterService;

        private $sessionRepo;

        public function __construct(VisitorCounterService $visitorCounterService, SessionRepository $sessionRepository)
        {
            $this -> visitorCounterService = $visitorCounterService;
            $this -> sessionRepo = $sessionRepo;
        }

        public function getNumberOfVisitors(int $itemId) : int
        {
            $sessionItemArray = $this -> sessionRepo -> get("auctionSession");

            if (is_array($sessionItemArray))
            {
                if (in_array($itemId, $sessionItemArray))
                {
                    return $this -> visitorCounterService -> getNumberOfVisitorsForItemId($itemId);
                }
                else
                {
                    $sessionRepo -> push("auctionSession", $itemId);

                    return $this -> visitorCounterService -> increaseNumberOfVisitorsForItemId($itemId);
                }
            }
            else
            {
                $sessionRepo -> set("auctionSession", [$itemId]);

                return $this -> visitorCounterService -> increaseNumberOfVisitorsForItemId($itemId);

            }

            return - 1;
        }
    }
