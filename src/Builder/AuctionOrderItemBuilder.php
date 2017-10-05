<?php //strict

    namespace PluginAuctions\Builder;

    use IO\Builder\Order\OrderItemType;
    use function PHPSTORM_META\type;
    use Plenty\Modules\Frontend\Services\VatService;


    /**
     * Class OrderItemBuilder
     * @package IO\Builder\Order
     */
    class AuctionOrderItemBuilder {

        public function __construct(
//            VatService $vatService
        )
        {
//            $this -> vatService = $vatService;
        }

        public function getOrderItem($auctionParams) //: array
        {

            if ($auctionParams)
            {
                return gettype($auctionParams);
            }


//		$currentLanguage = pluginApp(SessionStorageService::class)->getLang();
            $orderItems = [];

//            $auctionItemName = $auctionParams['orderItemName']; // $item['variation']['data']['texts']['name1'];

            array_push($orderItems, $this -> buildOrderItem($auctionParams));

            return $orderItems;
        }

        private function buildOrderItem($auctionParams) : array
        {

            return [
                "typeId"            => OrderItemType::VARIATION,
                "referrerId"        => 1, // Mandant Shop ???
                "itemVariationId"   => $auctionParams['variationId'], // $item['variation']['id'], // 38443
                "quantity"          => 1, // bei Auktionen immer nur 1
                "orderItemName"     => $auctionParams['orderItemName'],
                "shippingProfileId" => 34, // Todo config ??? Standard für Auktionen
                // "countryVatId"      => $this -> vatService -> getCountryVatId(),
                // "vatRate"           => $basketItem->vat,
                // "vatField"			=> $basketItem->vatField,// TODO
                // "orderProperties"   => $basketItemProperties,
                "amounts"           => [
                    [
                        "currency"           => "EUR",
                        "priceOriginalGross" => $auctionParams['lastPrice'],
                        "surcharge"          => 0,
                        "isPercentage"       => 1
                    ]
                ]
            ];
        }

    }
