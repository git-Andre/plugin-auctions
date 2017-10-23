<?php

    namespace PluginAuctions\Containers;

//    use Plenty\Plugin\SessionRepository;
    use Plenty\Plugin\Templates\Twig;
    use PluginAuctions\Controllers\VisitorCounterSessionController;

    class SingleItemAuctionContainer {

//        use Loggable;

//        private $visitorCounterSessionController;
//
//        public function __construct(VisitorCounterSessionController $visitorCounterSessionController)
//        {
//            $this -> visitorCounterSessionController = $visitorCounterSessionController;
//        }

        public function call(Twig $twig, $arg)
        {

//            $visitorCounterSessionController = VisitorCounterSessionController::class;
//
//            $itemId = $arg[0]['item']['id'];
//
//            $itemIdArray = $visitorCounterSessionController -> getItemArray($itemId);

            $itemIdArray = ['hi ','Andrè', 'first'];

            return $twig -> render('PluginAuctions::Containers.SingleItemAuction', ["itemData"       => $arg[0],
                                                                                    "itemIdArray"    => $itemIdArray
            ]);
        }

    }
