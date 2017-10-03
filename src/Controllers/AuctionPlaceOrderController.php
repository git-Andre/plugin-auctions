<?php //strict
    namespace PluginAuctions\Controllers;

    use IO\Services\NotificationService;
    use IO\Controllers\LayoutController;

    use PluginAuctions\Services\AuctionOrderService;
//use Plenty\Plugin\Http\Response;
//use Plenty\Plugin\Http\Request;

    /**
     * Class AuctionPlaceOrderController
     * @package IO\Controllers
     */
    class AuctionPlaceOrderController extends LayoutController {

        /**
         * @param OrderService $orderService
         * @param NotificationService $notificationService
         * @param Response $response
         * @return \Symfony\Component\HttpFoundation\Response
         */
        public function placeOrder(
            AuctionOrderService $orderService,
            NotificationService $notificationService
        )
        {


            try
            {
                $orderData = $orderService -> placeOrder();

                return "redirectTo("; // $response->redirectTo( "execute-payment/" . $orderData->order->id . (strlen($redirectParam) ? "/?redirectParam=" . $redirectParam : '') );
            }
            catch ( \Exception $exception )
            {
                // TODO get better error text
                $notificationService -> error($exception -> getMessage());

                return "checkout"; // $response->redirectTo("checkout");
            }
        }

        public function getOrderById(AuctionOrderService $orderService, int $orderId)
        {
            $orderData = $orderService -> findOrderById($orderId);

            return $orderData;
        }

    }
