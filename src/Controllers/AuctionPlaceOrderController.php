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
        private $request;
        private $response;

        public function __construct(
            AuctionOrderService $orderService,
            Request $request,
            Response $response
        )
        {
            $this -> orderService = $orderService;
            $this -> request = $request;
            $this -> response = $response;
        }

//        public function
//        triggerPlaceOrder($auctionId)
//        {
//            try
//            {
//                $result = $this -> placeOrder($auctionId);
//                return $result;
//            }
//            catch (\Exception $exception )
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
//        /**
//         * @param $auctionId
//         * @return \IO\Models\LocalizedOrder|string
//         */
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

        public function createOrder() //: Response
        {
            $auctionId = (int) $this -> request -> get("auctionid");

            if ($auctionId > 0)
            {
//                $order = pluginApp(AuctionOrderService::class) -> placeOrder($auctionId);
//
//                return $this -> response -> create($order, ResponseCode::OK);
//                return $this -> response -> create($auctionId, ResponseCode::EXPECTATION_FAILED);
                return $this -> response -> json($this -> request);
            }

            return $this -> response -> json($auctionId);


        }

        public function index() //: Response
        {
            $auctionId = (int) $this -> request -> get("auctionid");

            if ($auctionId > 0)
            {
                return $this -> response -> json($this -> request);
            }

            return $this -> response -> make($auctionId);
        }

    }
