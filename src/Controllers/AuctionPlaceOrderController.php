<?php //strict
    namespace PluginAuctions\Controllers;

//    use IO\Services\NotificationService;
    use IO\Controllers\LayoutController;
    use Plenty\Plugin\Http\Request;
    use Plenty\Plugin\Http\Response;
    use PluginAuctions\Services\AuctionOrderService;

    /**
     * Class AuctionPlaceOrderController
     * @package IO\Controllers
     */
    class AuctionPlaceOrderController extends LayoutController {

        private $orderService;

        public function __construct(
            AuctionOrderService $orderService
        )
        {
            $this -> orderService = $orderService;
        }

        public function
        triggerPlaceOrder($auctionId)
        {
            try
            {
                $result = $this -> $orderService -> placeOrder($auctionId);
                return $result;
            }
            catch (\Exception $exception )
            {
                return $exception -> getMessage(); // $response->redirectTo("checkout");
            }
        }

        public function getOrderById(int $orderId)
        {
            $orderData = $this -> orderService -> findOrderById($orderId);

            return $orderData;
        }
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

        public function createOrder(Request $request, Response $response) //: Response
        {
            $auctionId = $request -> get("auctionid");
//
//            if ($auctionId > 0)
//            {
//                $order = pluginApp(AuctionOrderService::class) -> placeOrder($auctionId);
////
////                return $this -> response -> create($order, ResponseCode::OK);
////                return $this -> response -> create($auctionId, ResponseCode::EXPECTATION_FAILED);
//                return $response -> make($order);
//            }
//
            return $response -> json($auctionId);
        }

        public function index(Request $request, Response $response) //: Response
        {
//            $auctionId = (int) $request -> get("auctionid");
//
//            if ($auctionId > 0)
//            {
//                return $response -> json($request);
//            }
            return $response -> json($request);
        }

    }
