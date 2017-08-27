<?php

    namespace PluginAuctions\Containers;

    use Plenty\Plugin\Templates\Twig;

    class VueComponentAuctionContainer {

        public function call(Twig $twig) : string
        {
            return $twig -> render('PluginAuctions::Containers.VueComponentAuction');
        }
    }
