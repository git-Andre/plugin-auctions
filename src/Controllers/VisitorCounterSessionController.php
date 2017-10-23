<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Log\Loggable;
    use Plenty\Plugin\SessionRepository;
    use PluginAuctions\Services\Database\VisitorCounterService;


    class VisitorCounterSessionController extends Controller {

        use Loggable;

//        private $visitorCounterService;
//
//        private $sessionRepo;
//
//        public function __construct(VisitorCounterService $visitorCounterService)
//        {
//
//
//        }

        public function getItemArray(int $itemId)
        {
//            $sessionRepo = pluginApp(SessionRepository::class);
//            $visitorCounterService = pluginApp(VisitorCounterService::class);

            return [$itemId];


//            $sessionRepo = pluginApp(SessionRepository::class);
//
//
//            $sessionRepo -> set("itemIdArray", [$itemId]);
//
//            $sessionRepo -> push("itemIdArray", $itemId);
//
//
//            return $sessionRepo -> get("itemIdArray");

        }

    }
