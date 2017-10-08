<?php //strict
    namespace PluginAuctions\Controllers;

    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use Plenty\Plugin\Http\Response;
    use PluginAuctions\Services\AuctionOrderService;

//    use IO\Services\NotificationService;

    /**
     * Class AuctionPlaceOrderController
     * @package IO\Controllers
     */
    class AuctionPlaceOrderController extends Controller {

        private $orderService;

        public function __construct(
            AuctionOrderService $orderService
        )
        {
            $this -> orderService = $orderService;
        }

//        public function triggerPlaceOrder($auctionId)
//        {
//            try
//            {
//                $result = $this -> placeOrder($auctionId);
//
//                return $result;
//            }
//            catch ( \Exception $exception )
//            {
//                return $exception -> getMessage(); // $response->redirectTo("checkout");
//            }
//        }
//
//        private function placeOrder($auctionId)
//        {
//            try
//            {
//                $orderData = $this -> orderService -> placeOrder($auctionId); // helper für http-Trigger
//
////                return "redirectTo("; // $response->redirectTo( "execute-payment/" . $orderData->order->id . (strlen($redirectParam) ? "/?redirectParam=" . $redirectParam : '') );
//                return $orderData;
//            }
//            catch ( \Exception $exception )
//            {
//                return $exception -> getMessage(); // $response->redirectTo("checkout");
//            }
//        }
//
//        public function getOrderById(AuctionOrderService $orderService, int $orderId)
//        {
//            $orderData = $this -> orderService -> findOrderById($orderId);
//
//            return $orderData;
//        }
//

        /**
         * Create an order
         * @return Response
         */
        public function createOrder(Request $request, Response $response) //: Response
        {
            $auctionId = (int) $this -> request -> get("auctionid");

            if ($auctionId > 0)
            {
//                $order = pluginApp(AuctionOrderService::class) -> placeOrder($auctionId);
//
//                return $this -> response -> create($order, ResponseCode::OK);
//                return $this -> response -> create($auctionId, ResponseCode::EXPECTATION_FAILED);
                return $response -> json($request);
            }

            return $response -> json($auctionId);


        }

        public function index(Request $request, Response $response) //: Response
        {
            $auctionId = (int) $this -> request -> get("auctionid");

            if ($auctionId > 0)
            {
                return $response -> json($request);
            }

            return $response -> make($auctionId);
        }
    }
