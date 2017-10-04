<?php //strict
    namespace PluginAuctions\Services;

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
         * @var UserSession
         */
        private $userSession = null;

        private $itemService;

        public function __construct(
            ItemService $itemService,
            ContactRepositoryContract $contactRepository,
            ContactAddressRepositoryContract $contactAddressRepository,
            AddressRepositoryContract $addressRepository
        )
        {
            $this -> itemService = $itemService;
            $this -> contactRepository = $contactRepository;
            $this -> contactAddressRepository = $contactAddressRepository;
            $this -> addressRepository = $addressRepository;
        }

        public function getItemById(int $itemId)
        {
            $item = $this -> itemService -> getItem($itemId);

            return $item['documents'];
        }

        /**
         * @param int $contactId
         * @return Contact|string
         */
        public function getCustomerById(int $contactId)
        {
            $contact = $this -> contactRepository -> findContactById($contactId);

            if ($contact)
            {
                return $contact;
            }
            return "kein Kunde...";
        }
        public function getCustomerAddresses(int $contactId)
        {
            $contactAddresses = $this -> $contactAddressRepository -> getAddresses($contactId);

            if ($contactAddresses)
            {
                return $contactAddresses;
            }
            return "kein Kunde...";
        }
    }
