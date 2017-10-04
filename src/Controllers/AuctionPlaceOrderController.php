<?php //strict
    namespace PluginAuctions\Controllers;

//    use IO\Services\NotificationService;
    use IO\Controllers\LayoutController;

    use PluginAuctions\Services\AuctionOrderService;
//use Plenty\Plugin\Http\Response;
//use Plenty\Plugin\Http\Request;

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

        /**
         * @param $auctionId
         * @return \IO\Models\LocalizedOrder|string
         */
        public function placeOrder($auctionId)
        {
            try
            {
                $orderData = $this -> orderService -> placeOrder($auctionId); // helper für http-Trigger

//                return "redirectTo("; // $response->redirectTo( "execute-payment/" . $orderData->order->id . (strlen($redirectParam) ? "/?redirectParam=" . $redirectParam : '') );
                return $orderData;
            }
            catch ( \Exception $exception )
            {
                return $exception -> getMessage(); // $response->redirectTo("checkout");
            }
        }

        public function getOrderById(AuctionOrderService $orderService, int $orderId)
        {
            $orderData = $this -> orderService -> findOrderById($orderId);

            return $orderData;
        }

    }
