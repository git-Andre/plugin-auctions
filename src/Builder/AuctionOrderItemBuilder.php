<?php //strict

    namespace PluginAuctions\Builder;

    use IO\Builder\Order\OrderItemType;
    use Plenty\Plugin\Log\Loggable;


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

            $lastPrice = (float) $auctionParams['lastPrice']; // Todo config ???
            $agio = $lastPrice * 0.1; // Todo config ???
            $priceWithoutAgio = $lastPrice - $agio; // Todo config ???

            $orderItem = [
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
                        "priceOriginalNet"   => $lastPrice,
                        "priceOriginalGross" => $lastPrice,
//                        "priceNet" => $lastPrice,
//                        "priceGross" => $lastPrice,
                        "surcharge"          => $agio,
                        "discount"           => - 0.5,
                        "isPercentage"       => 1 // discount prozentual
                    ]
                ],
                "orderProperties"   => [

                    [
                        "propertyId" => 31, // Artikel-Merkmal für Aufgeld Todo config
                        "value"      => $agio,
                        "name"       => "Auktion Aufgeld 10%"
                    ]
                ]
            ];
            $this -> getLogger(__METHOD__)
                  -> setReferenceType('auctionVarId')
                  -> setReferenceValue((int) $auctionParams['itemVariationId'])
                  -> debug('PluginAuctions::auctions.info', ['$orderItem: ' => $orderItem]);


            return $orderItem;
        }
    }
