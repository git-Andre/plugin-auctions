<?php

    namespace PluginAuctions\Containers;

    use Plenty\Plugin\Templates\Twig;
    use Plenty\Plugin\SessionRepository;
    use IO\Services\SessionStorageService;

    class SingleItemAuctionContainer {

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
            $session = pluginApp(SessionStorageService::class);
            $sessionRepo = pluginApp(SessionRepository::class);

//            $session -> setSessionValue("counter", "testValue"); // test
            $sessionRepo -> set("repo", $itemId); // test
            $visitorCounter = $sessionRepo -> get("repo"); // test
//            $visitorCounter = $session -> getSessionValue("counter"); // test
//            $visitorCounter = $session -> getSessionValue("testCounter"); // test

            return $twig -> render('PluginAuctions::Containers.SingleItemAuction', ["itemData"       => $arg[0],
                                                                                    "visitorCounter" => $visitorCounter
            ]);
        }

    }
