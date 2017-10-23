<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Log\Loggable;
    use Plenty\Plugin\SessionRepository;
    use PluginAuctions\Services\Database\VisitorCounterService;


    class VisitorCounterSessionController extends Controller {

        use Loggable;

        private $visitorCounterService;
        private $sessionRepo;

        public function __construct(VisitorCounterService $visitorCounterService)
        {
            $this -> visitorCounterService = $visitorCounterService;

//            $this -> sessionRepo = pluginApp(SessionRepository::class);

        }

        public function getItemArray(int $itemId)
        {

            // sessionstorage (Service) abfragen
//            $session = pluginApp(SessionStorageService::class);
            $sessionRepo = pluginApp(SessionRepository::class);


            $sessionRepo -> set("itemIdArray", [$itemId]);
//            if ($repoTestEins != $itemId)
//            {
//                $sessionRepo -> set("testEins", $itemId);
////                $sessionRepo -> set("itemIdArray", $itemId);
////                $sessionRepo -> set("prependTest", 1);
//            }
//            $repoTestEins += $repoTestEins;
//            $visitorCounter = $sessionRepo -> get("testEins");
            $sessionRepo -> push("itemIdArray", $itemId);
//            $prependTest += $sessionRepo -> get("prependTest");

//            $sessionRepo -> prepend("prependTest", 1);
//            $this -> getLogger(__METHOD__)
//                  -> setReferenceType('auctionId')
//                  -> setReferenceValue($itemId)
//                  -> debug('PluginAuctions::auctions.debug', ['prependTest: ' => $prependTest]);

//            $sessionRepo -> push("itemIdArray", 0);
//            $this -> getLogger(__METHOD__)
//                  -> setReferenceType('auctionId')
//                  -> setReferenceValue($itemId)
//                  -> debug('PluginAuctions::auctions.debug', ['itemIdArray: ' => $itemIdArray]);
//
//            $visitorCounter = $sessionRepo -> get("testEins");
//            $this -> getLogger(__METHOD__)
//                  -> setReferenceType('auctionId')
//                  -> setReferenceValue($itemId)
//                  -> debug('PluginAuctions::auctions.debug', ['testEins: ' => $testEins]);

            return $sessionRepo -> get("itemIdArray");
        }

    }
