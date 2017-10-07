<?php //strict

    namespace PluginAuctions\Api\Resources;

    use IO\Api\ApiResource;
    use IO\Api\ApiResponse;
    use IO\Api\ResponseCode;
    use IO\Services\CustomerService;
    use Plenty\Plugin\Http\Request;
    use Plenty\Plugin\Http\Response;
    use PluginAuctions\Services\AuctionOrderService;

    /**
     * Class OrderResource
     * @package IO\Api\Resources
     */
    class AuctionOrderResource extends ApiResource {

        /**
         * OrderResource constructor.
         * @param Request $request
         * @param ApiResponse $response
         */
        public function __construct(
            Request $request,
            ApiResponse $response
        )
        {
            parent ::__construct($request, $response);
        }

        /**
         * List the orders of the customer
         * @return Response
         */
        public function index() : Response
        {
            $page = (int) $this -> request -> get("page", 1);
            $items = (int) $this -> request -> get("items", 10);

            $data = pluginApp(CustomerService::class) -> getOrders($page, $items);

            return $this -> response -> create($data, ResponseCode::OK);
        }

        /**
         * Create an order
         * @return Response
         */
        public function store() : Response
        {
            $auctionId = (int) $this -> request -> get("auctionId", 0);

            if ($auctionId > 0)
            {
//                $order = pluginApp(AuctionOrderService::class) -> placeOrder($auctionId);
//
                return $this -> response -> create($auctionId, ResponseCode::OK);
            }

            return $this -> response -> create("Fehler in store", ResponseCode::NOT_ACCEPTABLE);

        }
    }
