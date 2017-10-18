<?php //strict

    namespace PluginAuctions\Builder;

    use IO\Builder\Order\OrderItemType;


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

            $lastPrice = (float) $auctionParams['lastPrice']; // Todo config ???
            $agio = $lastPrice * 0.1; // Todo config ???
            $priceWithoutAgio = $lastPrice - $agio; // Todo config ???

            return [
                "typeId"            => OrderItemType::VARIATION,
                "referrerId"        => 9, // Mandant Auktion (Shop)
                "itemVariationId"   => (int) $auctionParams['itemVariationId'],  // 38443
                "quantity"          => 1, // bei Auktionen immer nur 1
                "orderItemName"     => $auctionParams['orderItemName'],
                "shippingProfileId" => 34, // Todo config ??? Standard für Auktionen
                "amounts"           => [
                    [
                        "isSystemCurrency"   => 1,
                        "currency"           => "EUR",
                        "priceOriginalNet" => $priceWithoutAgio,
                        "priceOriginalGross" => $lastPrice,
                        "surcharge"          => $agio,
                        "isPercentage"       => 1 // discount prozentual
                    ]
                ],
                "orderProperties"   => [
                    [
                        "propertyId" => 30, // Artikel-Merkmal für Aufgeld Todo config
                        "value"      => "10%",
                        "name"       => "Aufgeld Auktion"
                    ]
                ]
            ];
        }
    }
