<?php //strict

    namespace PluginAuctions\Builder;

    use IO\Builder\Order\OrderItemType;
    use Plenty\Modules\Frontend\Services\VatService;


    /**
     * Class OrderItemBuilder
     * @package IO\Builder\Order
     */
    class AuctionOrderItemBuilder {

        public function getOrderItem($auctionParams) : array
        {
            $orderItems = [];

            array_push($orderItems, $this -> buildOrderItem($auctionParams));

            return $orderItems;
        }

        private function buildOrderItem($auctionParams) : array
        {



            return [
                "typeId"            => OrderItemType::VARIATION,
                "referrerId"        => 9, // Mandant Auktion (Shop)
                "itemVariationId"   => (int)$auctionParams['itemVariationId'],  // 38443
                "quantity"          => 1, // bei Auktionen immer nur 1
                "orderItemName"     => $auctionParams['orderItemName'],
                "shippingProfileId" => 34, // Todo config ??? Standard für Auktionen
                "amounts"           => [
                    [
                        "currency"           => "EUR",
                        "priceOriginalGross" => (float) $auctionParams['lastPrice'],
                        "surcharge"          => 0,
                        "isPercentage"       => 1
                    ]
                ]
            ];
        }

    }
