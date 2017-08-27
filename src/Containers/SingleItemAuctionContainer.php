<?php

    namespace PluginAuctions\Containers;

    use Plenty\Plugin\Templates\Twig;

    class SingleItemAuctionContainer {


        public function call(Twig $twig, $arg):string
        {
            return $twig->render('PluginAuctions::Containers.SingleItemAuction', ["itemData" => $arg[0]]);
        }

    }
