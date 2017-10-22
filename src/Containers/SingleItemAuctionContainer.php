<?php

    namespace PluginAuctions\Containers;

    use Plenty\Plugin\SessionRepository;
    use Plenty\Plugin\Templates\Twig;

    //    use Plenty\Plugin\Log\Loggable;

    class SingleItemAuctionContainer {

//        use Loggable;

//        private $sessionStorageService;
//
//        public function __construct(SessionStorageService $sessionStorageService)
//        {
//            $this -> sessionStorageService = $sessionStorageService;
//        }
//
        public function call(Twig $twig, $arg) : string
        {
            $itemId = $arg[0]['item']['id'];


            // sessionstorage (Service) abfragen
//            $session = pluginApp(SessionStorageService::class);
            $sessionRepo = pluginApp(SessionRepository::class);

            $repoTestEins = $sessionRepo -> get("testEins"); // test

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


            return $twig -> render('PluginAuctions::Containers.SingleItemAuction', ["itemData"       => $arg[0],
                                                                                    "visitorCounter" => $sessionRepo -> get("testEins"),
                                                                                    "itemIdArray"       => $sessionRepo -> get("itemIdArray")
            ]);
        }

    }
