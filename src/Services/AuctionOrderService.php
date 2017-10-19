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
                          -> debug('PluginAuctions::auctions.debugBefor', ['config?: ' => $config->get("PluginAuctions.global.shippingProfile")]);

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
