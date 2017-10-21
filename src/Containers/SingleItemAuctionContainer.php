<?php

    namespace PluginAuctions\Containers;

    use Plenty\Plugin\Templates\Twig;
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

            $visitorCounter = $this -> session -> getLang(); // test
//            $visitorCounter = $session -> getSessionValue("testCounter"); // test

            return $twig -> render('PluginAuctions::Containers.SingleItemAuction', ["itemData"       => $arg[0],
                                                                                    "visitorCounter" => $visitorCounter
            ]);
        }

    }
