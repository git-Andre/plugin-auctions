<?php //strict

    namespace PluginAuctions\Builder;

    use IO\Builder\Order\OrderItemType;
    use Plenty\Plugin\Log\Loggable;
    use Plenty\Plugin\ConfigRepository;


    /**
     * Class OrderItemBuilder
     * @package IO\Builder\Order
     */
    class AuctionOrderItemBuilder {

        use Loggable;

        public function getOrderItem($auctionParams) : array
        {
            $orderItems = [];

            array_push($orderItems, $this -> buildOrderItem($auctionParams));

            return $orderItems;
        }

        private function buildOrderItem($auctionParams) : array
        {
            $config = pluginApp(ConfigRepository::class);

            $lastPrice = (float) $auctionParams['lastPrice'];
            $agio = $lastPrice * ($config -> get("PluginAuctions.global.agioPercentual") / 100);
            $priceWithoutAgio = $lastPrice - $agio;
            $formattedAgio = sprintf("%01.2f €", $agio);

            $orderItem = [
                "typeId"            => OrderItemType::VARIATION,
                // Herkunft für Auftrag Auktion (Shop
                "referrerId"        => $config -> get("PluginAuctions.global.referrerId"),
                "itemVariationId"   => (int) $auctionParams['itemVariationId'],
                "quantity"          => 1, // bei Auktionen immer nur 1
                "orderItemName"     => $auctionParams['orderItemName'],
                "shippingProfileId" => $config -> get("PluginAuctions.global.shippingProfile"),
                "amounts"           => [
                    [
                        "isSystemCurrency"   => 1,
                        "currency"           => "EUR",
//                        "priceOriginalNet"   => $lastPrice,
                        "priceOriginalGross" => $lastPrice,
                        "surcharge"          => $agio,
                    ]
                ],
                "orderProperties"   => [
                    [
                        "propertyId" => $config -> get("PluginAuctions.global.orderProperty"), // Artikel-BestellMerkmal für Aufgeld
                        "value"      => $formattedAgio,
                        "name"       => "Aufgeld Auktion 10%:"
                    ]
                ]
            ];
            return $orderItem;
        }
    }
