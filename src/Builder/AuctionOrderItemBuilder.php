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
            $formattedAgio = sprintf("%01.2f EUR", $agio);

            $orderItem = [
                "typeId"            => OrderItemType::VARIATION,
                "referrerId"        => 1, // Mandant Auktion (Shop) - TodO eigene id ohne AuftragsFehler...
                "itemVariationId"   => (int) $auctionParams['itemVariationId'],  // 38443
                "quantity"          => 1, // bei Auktionen immer nur 1
                "orderItemName"     => $auctionParams['orderItemName'],
                "shippingProfileId" => 34, // Todo config ??? Standard für Auktionen
                "amounts"           => [
                    [
                        "isSystemCurrency"   => 1,
                        "currency"           => "EUR",
//                        "priceOriginalNet"   => $lastPrice,
                        "priceOriginalGross" => $lastPrice,
//                        "priceNet" => $lastPrice,
//                        "priceGross" => $lastPrice,
                        "surcharge"          => $agio,
//                        "discount"           => - 10,
//                        "isPercentage"       => 1 // discount prozentual
                    ]
                ],
                "orderProperties"   => [

                    [
                        "propertyId" => 30, // Artikel-Merkmal für Aufgeld Todo config
                        "value"      => $formattedAgio,
                        "name"       => "Aufgeld Auktion 10%"
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
