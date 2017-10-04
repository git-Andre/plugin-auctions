<?php //strict

    namespace PluginAuctions\Builder;

    use IO\Builder\Order\OrderItemType;
    use IO\Services\CheckoutService;
    use Plenty\Modules\Basket\Models\Basket;
    use Plenty\Modules\Frontend\Services\VatService;


    /**
     * Class OrderItemBuilder
     * @package IO\Builder\Order
     */
    class AuctionOrderItemBuilder {

//	/**
//	 * @var CheckoutService
//	 */
//	private $checkoutService;
//
        /**
         * @var VatService
         */
//        private $vatService;

        /**
         * OrderItemBuilder constructor.
         * @param CheckoutService $checkoutService
         */
        public function __construct(
//            VatService $vatService
        )
        {
//            $this -> vatService = $vatService;
        }

        /**
         * Add auction item to the order
         * @param array $item
         * @return array
         */
        public function getOrderItem(array $item) : array
        {
//		$currentLanguage = pluginApp(SessionStorageService::class)->getLang();
            $orderItems = [];
//			$basketItemName = $item[$basketItem->variationId]->itemDescription->name1;
//            $auctionItemName = 'test';
//            $auctionItemName = $item['variationId']; // $item['variation']['data']['texts']['name1'];
            $auctionItemName = "test name"; // $item['texts']['name1'];


            array_push($orderItems, $this -> buildOrderItem($item, (STRING) $auctionItemName));

            return $orderItems;
        }

        /**
         * @param $item
         * @param string $auctionItemName
         * @return array
         */
        private function buildOrderItem($item, string $auctionItemName) : array
        {

            return [
                "typeId"            => OrderItemType::VARIATION,
                "referrerId"        => 1,
                "itemVariationId"   => 38443, // $item['variation']['id'], // 38443
                "quantity"          => 1,
                "orderItemName"     => $auctionItemName,
                "shippingProfileId" => 34, // Todo config ???
//                "countryVatId"      => $this -> vatService -> getCountryVatId(),
//			"vatRate"           => $basketItem->vat,
                // "vatField"			=> $basketItem->vatField,// TODO
//            "orderProperties"   => $basketItemProperties,
                "amounts"           => [
                    [
                        "currency"           => "EUR",
                        "priceOriginalGross" => 74.56, // $basketItem->price
                        "surcharge"          => 0,
                        "isPercentage"       => 1
                    ]
                ]
            ];
        }

    }
