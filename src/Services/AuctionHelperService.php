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
    use PluginAuctions\Services\Database\AuctionsService;


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
        private $auctionService;

        public function __construct(
            AuctionsService $auctionService,
            ItemService $itemService,
            ContactRepositoryContract $contactRepository,
            ContactAddressRepositoryContract $contactAddressRepository,
            AddressRepositoryContract $addressRepository
        )
        {
            $this -> auctionService = $auctionService;
            $this -> itemService = $itemService;
            $this -> contactRepository = $contactRepository;
            $this -> contactAddressRepository = $contactAddressRepository;
            $this -> addressRepository = $addressRepository;
        }

        public function auctionParamsBuilder($auctonId)
        {
            $auction = $this -> auctionService -> getAuction($auctonId);
            $lastBidder = array_slice($auction -> bidderList, -1)[0];
            $lastPrice = $lastBidder['bidPrice'];
            $lastCustomerId = $lastBidder['customerId'] - 46987; // Todo siehe krypt...

            $item = $this -> getItemById($auction -> itemId);

            // variation id - services.item.getVariation(item.documents[0].data.variation.id)
            // {% set itemVariationData = itemGetVariation.documents[0].data %}
            //  <title>{{ item.documents[0].data.texts | itemName(configItemName) }}
            // {{ item.documents[0].data.texts | itemName(2) }}

            $customer = $this -> getCustomerById($lastCustomerId);
            return $customer;
        }


        public function getItemById(int $itemId)
        {
            $item = $this -> itemService -> getItem($itemId);

            return $item['documents'][0]['data'];
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
            $contactAddresses = $this -> contactAddressRepository -> getAddresses($contactId);

            if ($contactAddresses)
            {
                return $contactAddresses;
            }

            return "kein Kunde...";
        }
    }
