<?php //strict
    namespace PluginAuctions\Services;

    use IO\Controllers\LayoutController;
    use IO\Services\ItemService;
    use IO\Builder\Order\AddressType;
    use Plenty\Modules\Account\Address\Contracts\AddressRepositoryContract;
    use Plenty\Modules\Account\Contact\Contracts\ContactAddressRepositoryContract;
    use Plenty\Modules\Account\Contact\Contracts\ContactRepositoryContract;
    use Plenty\Modules\Account\Contact\Models\Contact;
    use PluginAuctions\Services\Database\AuctionsService;

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
            $lastBidder = array_slice($auction -> bidderList, - 1)[0];
            $lastPrice = $lastBidder['bidPrice'];
            $lastCustomerId = $lastBidder['customerId'] - 46987; // Todo siehe krypt...

            $item = $this -> getItemById($auction -> itemId);
            $itemVariationId = $item['item']['mainVariationId'];
            $itemNameForOrder = $item['texts'][0]['name1'];

            $customerBillingAddress = $this -> getCustomerAddresses($lastCustomerId, AddressType::BILLING, true);
            $customerDeliveryAddress = $this -> getCustomerAddresses($lastCustomerId, AddressType::DELIVERY, true);
            if (!$customerDeliveryAddress)
            {
                $customerDeliveryAddress = $customerBillingAddress;
            }

            $auctionOrderParams = [
                "lastPrice"               => $lastPrice,
                "itemVariationId"         => $itemVariationId,
                "orderItemName"           => $itemNameForOrder,
                "customerBillingAddressId"  => $customerBillingAddress['id'],
                "customerDeliveryAddressId" => $customerDeliveryAddress['id'],
            ];
            return $auctionOrderParams;
        }


        public function getItemById(int $itemId)
        {
            $item = $this -> itemService -> getItem($itemId);

            return $item['documents'][0]['data'];
        }

        public function getCustomerAddresses(int $contactId, int $typeId, bool $last)
        {
            $contactAddresses = $this -> contactAddressRepository -> findContactAddressByTypeId($contactId, $typeId, $last);

            if ($contactAddresses)
            {
                return $contactAddresses;
            }

            return "kein Kunde...";
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
    }
