<?php

    namespace PluginAuctions\Containers;

    use Plenty\Plugin\Templates\Twig;

    class BidderListModalContainer {


        public function call(Twig $twig, $arg):string
        {
            return $twig->render('PluginAuctions::Containers.BidderListModalContainer', ["itemData" => $arg[0]]);
        }

    }
