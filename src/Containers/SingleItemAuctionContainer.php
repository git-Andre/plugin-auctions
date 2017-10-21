<?php

    namespace PluginAuctions\Containers;

    use Plenty\Plugin\Templates\Twig;

    class SingleItemAuctionContainer {


        public function call(Twig $twig, $arg):string
        {
            // sessionstorage (Service) abfragen
            // "itemData" => $arg[0] - itemId abfragen
            // 

            $visitorCounter = (int) 55; // test
            return $twig->render('PluginAuctions::Containers.SingleItemAuction', ["itemData" => $arg[0], "visitorCounter" => $visitorCounter]);
        }

    }
