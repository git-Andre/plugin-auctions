<?php //strict
    namespace PluginAuctions\Controllers;

//    use IO\Services\NotificationService;
    use IO\Controllers\LayoutController;
    use IO\Services\ItemService;

    //use Plenty\Plugin\Http\Response;
//use Plenty\Plugin\Http\Request;

    /**
     * Class AuctionPlaceOrderController
     * @package IO\Controllers
     */
    class AuctionTestController extends LayoutController {

        private $itemService;

        public function __construct(
            ItemService $itemService
        )
        {
            $this -> itemService = $itemService;
        }

        public function testItemService($itemId)
        {
            return $this -> itemService -> getItem($itemId);
        }
    }
