<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Log\Loggable;

    use PluginAuctions\Services\Database\VisitorCounterService;


    class VisitorCounterSessionController extends Controller {

        use Loggable;

        private $visitorCounterService;

        public function __construct(VisitorCounterService $visitorCounterService)
        {
            $this -> visitorCounterService = $visitorCounterService;
        }

    }
