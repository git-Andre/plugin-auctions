<?php

    namespace PluginAuctions\Builder;

    use Plenty\Plugin\Application;
    use PluginAuctions\Services\Database\AuctionsService;
    use IO\Builder\Order\ReferenceType;
    use IO\Builder\Order\RelationType;


    /**
     * Class AuctionOrderBuilderQuery
     * @package IO\Builder\Order
     */
    class AuctionOrderBuilderQuery {

        /**
         * @var array
         */
        private $order;

        /**
         * @var Application
         */
        private $app;

        /**
         * @var AuctionsService
         */
        private $auctionService;

        /**
         * AuctionOrderBuilderQuery constructor.
         * @param Application $app
         * @param int $type
         * @param int $plentyId
         */
        public function __construct(Application $app, AuctionsService $auctionService, int $type, int $plentyId)
        {
            $this -> app = $app;

            $this -> order = [];
            $this -> order["typeId"] = $type;
            $this -> order["plentyId"] = $plentyId;
        }

        /**
         * Return the order array
         * @return array
         */
        public function done() : array
        {
            return $this -> order;
        }

        /**
         * Build order from basket data
         * @param null $basket
         * @return AuctionOrderBuilderQuery
         * @throws \Exception
         */
        public function fromAuction($auction = null) : AuctionOrderBuilderQuery
        {
            if ($auction === null)
            {
                $auction = $this -> auctionService -> getAuction(1);
            }

            // Add basket items to order
            $orderItemBuilder = $this -> app -> make(AuctionOrderItemBuilder::class);
            if ( ! $orderItemBuilder instanceof AuctionOrderItemBuilder)
            {
                throw new \Exception("Error while instantiating AuctionOrderItemBuilder.");
            }

//		$items = $this->basketService->getBasketItems();
//
//		if(!is_array($items))
//		{
//			throw new \Exception("Error while reading item data from basket");
//		}

            $this -> withOrderItems(
                $orderItemBuilder -> getOrderItem()
            );

            return $this;
        }

        /**
         * Add order items to the order
         * @param array $orderItems
         * @return AuctionOrderBuilderQuery
         */
        public function withOrderItems(array $orderItems) : AuctionOrderBuilderQuery
        {
            foreach ($orderItems as $orderItem)
            {
                $this -> withOrderItem($orderItem);
            }

            return $this;
        }

        /**
         * Add an order item to the order
         * @param array $orderItem
         * @return AuctionOrderBuilderQuery
         */
        public function withOrderItem(array $orderItem) : AuctionOrderBuilderQuery
        {
            if ($this -> order["orderItems"] === null)
            {
                $this -> order["orderItems"] = [];
            }
            array_push($this -> order["orderItems"], $orderItem);

            return $this;
        }

        /**
         * Add the status to the order
         * @param float $status
         * @return AuctionOrderBuilderQuery
         */
        public function withStatus(float $status) : AuctionOrderBuilderQuery
        {
            $this -> order["statusId"] = $status;

            return $this;
        }

        /**
         * Add the owner to the order
         * @param int $ownerId
         * @return AuctionOrderBuilderQuery
         */
        public function withOwner(int $ownerId) : AuctionOrderBuilderQuery
        {
            $this -> order["ownerId"] = $ownerId;

            return $this;
        }

        /**
         * Add an address to the order
         * @param int $addressId
         * @param int $type
         * @return AuctionOrderBuilderQuery
         */
        public function withAddressId(int $addressId, int $type) : AuctionOrderBuilderQuery
        {
            if ($this -> order["addressRelations"] === null)
            {
                $this -> order["addressRelations"] = [];
            }

            $address = [
                "typeId"    => (int) $type,
                "addressId" => $addressId
            ];
            array_push($this -> order["addressRelations"], $address);

            return $this;
        }

        /**
         * Add a contact to the order
         * @param int $customerId
         * @return AuctionOrderBuilderQuery
         */
        public function withContactId(int $customerId) : AuctionOrderBuilderQuery
        {
            $this -> withRelation(ReferenceType::CONTACT, $customerId, RelationType::RECEIVER);

            return $this;
        }

        /**
         * Add the relation to the order
         * @param string $type
         * @param int $referenceId
         * @param string $relationType
         * @return AuctionOrderBuilderQuery
         */
        public function withRelation(string $type, int $referenceId, string $relationType) : AuctionOrderBuilderQuery
        {
            if ($this -> order["relations"] === null)
            {
                $this -> order["relations"] = [];
            }

            $relation = [
                "referenceType" => (string) $type,
                "referenceId"   => $referenceId,
                "relation"      => (string) $relationType
            ];

            array_push($this -> order["relations"], $relation);

            return $this;
        }

        /**
         * Add an order option to the order
         * @param int $type
         * @param int $subType
         * @param $value
         * @return AuctionOrderBuilderQuery
         */
        public function withOrderProperty(int $type, int $subType, $value) : AuctionOrderBuilderQuery
        {
            if ($this -> order["properties"] === null)
            {
                $this -> order["properties"] = [];
            }

            $option = [
                "typeId"    => (int) $type,
                "subTypeId" => (int) $subType,
                "value"     => (string) $value
            ];

            array_push($this -> order["properties"], $option);

            return $this;
        }


    }
