<?php //strict

    namespace PluginAuctions\Services;

    use IO\Builder\Order\AddressType;
    use IO\Builder\Order\OrderOptionSubType;
    use IO\Builder\Order\OrderType;
    use IO\Models\LocalizedOrder;
    use Plenty\Modules\Order\Contracts\OrderRepositoryContract;
    use Plenty\Modules\Order\Property\Models\OrderPropertyType;
    use Plenty\Plugin\Log\Loggable;
    use PluginAuctions\Builder\AuctionOrderBuilder;
    use Plenty\Plugin\ConfigRepository;



    /**
     * Class OrderService
     * @package IO\Services
     */
    class AuctionOrderService {

        use Loggable;


        private $orderRepository;

        private $auctionHelperService;

        public function __construct(
            OrderRepositoryContract $orderRepository,
            AuctionHelperService $auctionHelperService
        )
        {
            $this -> orderRepository = $orderRepository;
            $this -> auctionHelperService = $auctionHelperService;
        }

        /**
         * Place an order
         * @return LocalizedOrder
         */
        public function placeOrder($auctionId) // : LocalizedOrder
        {
            $auctionParams = $this -> auctionHelperService -> auctionParamsBuilder($auctionId);
            $this -> getLogger(__METHOD__)
                  -> setReferenceType('auctionId')
                  -> setReferenceValue($config->get("PluginAuctions.global.shippingProfile"))
                  -> debug('PluginAuctions::auctions.debug', ['$auctionParams: ' => $auctionParams]);

            $config = pluginApp(ConfigRepository::class);

            if ($auctionParams['isSalableAndActive'])
            {
                $order = pluginApp(AuctionOrderBuilder::class)
                    -> prepare(OrderType::ORDER)
                    -> fromAuction($auctionParams) // TODO: (von plenty) Add shipping costs & payment surcharge as OrderItem
                    -> withStatus(3.0) // Status 3.0
                    -> withContactId($auctionParams['contactId'])
                    -> withAddressId($auctionParams['customerBillingAddressId'], AddressType::BILLING)
                    -> withAddressId($auctionParams['customerDeliveryAddressId'], AddressType::DELIVERY)
                    -> withOrderProperty(OrderPropertyType::PAYMENT_METHOD, OrderOptionSubType::MAIN_VALUE, $config->get("PluginAuctions.global.paymentMethod"))
                    -> withOrderProperty(OrderPropertyType::SHIPPING_PROFILE, OrderOptionSubType::MAIN_VALUE, $config->get("PluginAuctions.global.shippingProfile"))
                    -> done();
                try
                {
                    $this -> getLogger(__METHOD__)
                          -> debug('PluginAuctions::auctions.debugBefor', ['$order: ' => $order]);

                    $order = $this -> orderRepository -> createOrder($order);

                    $this -> getLogger(__METHOD__)
                          -> debug('PluginAuctions::auctions.debugAfter', ['$order danach: ' => $order]);

                    return LocalizedOrder ::wrap($order, "de");
                }
                catch ( \Exception $exception )
                {
                    $this -> getLogger(__FUNCTION__) -> error('PluginAuctions::place Order', $exception);
                }
            }
            $this -> getLogger(__METHOD__)
                  -> debug('PluginAuctions::auctions.debug', ['isSalableAndActive: ' => $auctionParams['isSalableAndActive']]);

            return false;
        }

//	public function findOrderByAccessKey($orderId, $orderAccessKey)
//    {
//        /**
//         * @var TemplateConfigService $templateConfigService
//         */
//        $templateConfigService = pluginApp(TemplateConfigService::class);
//        $redirectToLogin = $templateConfigService->get('my_account.confirmation_link_login_redirect');
//
//        $order = $this->orderRepository->findOrderByAccessKey($orderId, $orderAccessKey);
//
//        if($redirectToLogin == 'true')
//        {
//            /**
//             * @var CustomerService $customerService
//             */
//            $customerService = pluginApp(CustomerService::class);
//
//            $orderContactId = 0;
//            foreach ($order->relations as $relation)
//            {
//                if ($relation['referenceType'] == 'contact' && (int)$relation['referenceId'] > 0)
//                {
//                    $orderContactId = $relation['referenceId'];
//                }
//            }
//
//            if ((int)$orderContactId > 0)
//            {
//                if ((int)$customerService->getContactId() <= 0)
//                {
//                    return pluginApp(Response::class)->redirectTo('login?backlink=confirmation/' . $orderId . '/' . $orderAccessKey);
//                }
//                elseif ((int)$orderContactId !== (int)$customerService->getContactId())
//                {
//                    return null;
//                }
//            }
//        }
//
//        return LocalizedOrder::wrap($order, 'de');
//    }

//    /**
//     * @param $paymentMethodId
//     * @param int $orderId
//     * @return bool
//     */
//	public function allowPaymentMethodSwitchFrom($paymentMethodId, $orderId = null)
//	{
//		/** @var TemplateConfigService $config */
//		$config = pluginApp(TemplateConfigService::class);
//		if ($config->get('my_account.change_payment') == "false")
//		{
//			return false;
//		}
//		if($orderId != null)
//		{
//			$order = $this->orderRepository->findOrderById($orderId);
//			if ($order->paymentStatus !== OrderPaymentStatus::UNPAID)
//			{
//				// order was paid
//				return false;
//			}
//
//			$statusId = $order->statusId;
//			$orderCreatedDate = $order->createdAt;
//
//			if(!($statusId <= 3.4 || ($statusId == 5 && $orderCreatedDate->toDateString() == date('Y-m-d'))))
//			{
//				return false;
//			}
//		}
//		return $this->frontendPaymentMethodRepository->getPaymentMethodSwitchFromById($paymentMethodId, $orderId);
//	}
//
//
//    /**
//     * @param int $orderId
//     * @param int $paymentMethodId
//     */
//    public function switchPaymentMethodForOrder($orderId, $paymentMethodId)
//    {
//        if((int)$orderId > 0)
//        {
//            $currentPaymentMethodId = 0;
//
//            $order = $this->findOrderById($orderId);
//
//            $newOrderProperties = [];
//            $orderProperties = $order->order->properties;
//
//            if(count($orderProperties))
//            {
//                foreach($orderProperties as $key => $orderProperty)
//                {
//                    $newOrderProperties[$key] = $orderProperty;
//                    if($orderProperty->typeId == OrderPropertyType::PAYMENT_METHOD)
//                    {
//                        $currentPaymentMethodId = (int)$orderProperty->value;
//                        $newOrderProperties[$key]['value'] = (int)$paymentMethodId;
//                    }
//                }
//            }
//
//            if($paymentMethodId !== $currentPaymentMethodId)
//            {
//                if($this->frontendPaymentMethodRepository->getPaymentMethodSwitchFromById($currentPaymentMethodId, $orderId) && $this->frontendPaymentMethodRepository->getPaymentMethodSwitchToById($paymentMethodId))
//                {
//                    $order = $this->orderRepository->updateOrder(['properties' => $newOrderProperties], $orderId);
//                    if(!is_null($order))
//                    {
//                        return LocalizedOrder::wrap( $order, "de" );
//                    }
//                }
//            }
//        }
//
//        return null;
//    }

        /**
         * Find an order by ID
         * @param int $orderId
         * @return LocalizedOrder
         */
        public function findOrderById(int $orderId) : LocalizedOrder
        {
            $order = $this -> orderRepository -> findOrderById($orderId);

            return LocalizedOrder ::wrap($order, "de");
        }

    }
