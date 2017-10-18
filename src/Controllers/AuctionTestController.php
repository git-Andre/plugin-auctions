<?php //strict
    namespace PluginAuctions\Controllers;

//    use IO\Services\NotificationService;
    use IO\Controllers\LayoutController;
    use Plenty\Plugin\Http\Request;
    use Plenty\Plugin\Http\Response;


    /**
     * Class AuctionPlaceOrderController
     * @package IO\Controllers
     */
    class AuctionTestController extends LayoutController {

        public function __construct()
        {
        }

        public function testApi(Request $request, Response $response) //: Response
        {
            $auctionId = (int) $request -> get("auctionid");
//
//            if ($auctionId > 0)
//            {
//                return $response -> json($request);
//            }
            return $response -> json($auctionId);
        }

    }
