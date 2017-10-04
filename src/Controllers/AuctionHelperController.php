<?php //strict
    namespace PluginAuctions\Controllers;

//    use IO\Services\NotificationService;
    use IO\Controllers\LayoutController;
    use Plenty\Modules\Account\Contact\Models\Contact;
    use PluginAuctions\Services\AuctionHelperService;

    //use Plenty\Plugin\Http\Response;
//use Plenty\Plugin\Http\Request;


    /**
     * Class AuctionPlaceOrderController
     * @package IO\Controllers
     */
    class AuctionHelperController extends LayoutController {

        private $auctionHelperService;


        private $itemService;

        public function __construct(
            AuctionHelperService $auctionHelperService
        )
        {
            $this -> auctionHelperService = $auctionHelperService;
        }

        public function testItemService($itemId)
        {
            return $this -> auctionHelperService -> getItemById($itemId);
        }

        /**
         * Find the current contact by ID
         * @return null|Contact
         */
        public function testCustomerService(int $contactId)
        {
            if ($contactId > 0)
            {
                return $this -> auctionHelperService -> getCustomerById($contactId);
            }

            return "kein Kunde...";
        }
    }
