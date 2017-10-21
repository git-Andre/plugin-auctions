<?php //strict
    namespace PluginAuctions\Controllers;

//    use IO\Services\NotificationService;
    use IO\Controllers\LayoutController;
    use Plenty\Modules\Account\Contact\Models\Contact;
    use PluginAuctions\Services\AuctionParamsService;

    //use Plenty\Plugin\Http\Response;
//use Plenty\Plugin\Http\Request;


    /**
     * Class AuctionPlaceOrderController
     * @package IO\Controllers
     */
    class AuctionHelperController extends LayoutController {

        private $auctionParamsService;


        private $itemService;

        public function __construct(
            AuctionParamsService $auctionParamsService
        )
        {
            $this -> auctionParamsService = $auctionParamsService;
        }

        public function testItemService($itemId)
        {
            return $this -> auctionParamsService -> getItemById($itemId);
        }

        /**
         * Find the current contact by ID
         * @return null|Contact
         */
        public function testCustomerService(int $contactId)
        {
            if ($contactId > 0)
            {
                return $this -> auctionParamsService -> getCustomerById($contactId);
            }

            return "kein Kunde...";
        }
        public function testCustomerAddresses(int $contactId, $typeId, $last)
        {
            if ($contactId > 0)
            {
                return $this -> auctionParamsService -> getCustomerAddresses($contactId, $typeId, $last);
            }
            return "kein Kunde...";
        }
        public function auctionParamsBuilder(int $auctionId)
        {
            if ($auctionId > 0)
            {
                return $this -> auctionParamsService -> auctionParamsBuilder($auctionId);
            }
            return "keine Auktion...";
        }
    }
