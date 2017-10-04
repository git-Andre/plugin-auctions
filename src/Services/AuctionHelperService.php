<?php //strict
    namespace PluginAuctions\Controllers;

//    use IO\Services\NotificationService;
    use IO\Controllers\LayoutController;
    use IO\Services\ItemService;
    use Plenty\Modules\Account\Address\Contracts\AddressRepositoryContract;
    use Plenty\Modules\Account\Contact\Contracts\ContactAddressRepositoryContract;
    use Plenty\Modules\Account\Contact\Contracts\ContactRepositoryContract;
    use Plenty\Modules\Account\Contact\Models\Contact;

    //use Plenty\Plugin\Http\Response;
//use Plenty\Plugin\Http\Request;


    /**
     * Class AuctionPlaceOrderController
     * @package IO\Controllers
     */
    class AuctionHelperService extends LayoutController {

        /**
         * @var ContactRepositoryContract
         */
        private $contactRepository;
        /**
         * @var ContactAddressRepositoryContract
         */
        private $contactAddressRepository;
        /**
         * @var AddressRepositoryContract
         */
        private $addressRepository;
        /**
         * @var SessionStorageService
         */
        private $sessionStorage;
        /**
         * @var UserSession
         */
        private $userSession = null;


        private $itemService;

        public function __construct(
            ItemService $itemService,
            ContactRepositoryContract $contactRepository,
            ContactAddressRepositoryContract $contactAddressRepository,
            AddressRepositoryContract $addressRepository,
            SessionStorageService $sessionStorage
        )
        {
            $this -> itemService = $itemService;
            $this -> contactRepository = $contactRepository;
            $this -> contactAddressRepository = $contactAddressRepository;
            $this -> addressRepository = $addressRepository;
            $this -> sessionStorage = $sessionStorage;
        }

        public function getItemById(int $itemId)
        {
            $item = $this -> itemService -> getItem($itemId);

            return $item -> documents -> data;
        }

        /**
         * Find the current contact by ID
         * @return null|Contact
         */
        public function getCustomerById(int $contactId)
        {
            if ($contactId > 0)
            {
                return $this -> contactRepository -> findContactById($contactId);
            }
            return "kein Kunde...";
        }
    }
