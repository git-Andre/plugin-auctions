<?php

    namespace PluginAuctions\Services\Database;

//    use IO\Services\CustomerService;
//    use IO\Services\SessionStorageService;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use Plenty\Plugin\Log\Loggable;

    use PluginAuctions\Constants\BidStatus;
    use PluginAuctions\Models\Auction_7;
    use PluginAuctions\Models\Fields\AuctionBidderListEntry;


    //    use Illuminate\Support\Facades\App;
//    use Plenty\Modules\Plugin\DynamoDb\Contracts\DynamoDbRepositoryContract;


    class AuctionsService extends DataBaseService {

        use Loggable;

        protected $tableName = 'auctions';
//        /**
//         * @var CustomerService
//         */
//        private $customerService;
//
//        /**
//         * @var SessionStorageService
//         */
//        private $sessionStorage;

        /**
         * AuctionsService constructor.
         * @param DataBase $dataBase
         */

        public function __construct(DataBase $dataBase)
        {
            parent ::__construct($dataBase);
        }

//        public function __construct(DataBase $dataBase, CustomerService $customerService, SessionStorageService $sessionStorage)
//        {
//            parent ::__construct($dataBase);
//            $this -> customerService = $customerService;
//            $this -> sessionStorage = $sessionStorage;
//        }
//
        /**
         * @return bool|string
         */
        public function getAuctions()
        {
            $auctions = $this -> getValues(Auction_7::class);
            if ($auctions)
            {
                foreach ($auctions as $auction)
                {
                    $auction = $this -> buildAuctionView($auction);
                }
                unset($auction);

                return json_encode($auctions);
            }

            return false;
        }

        private function buildAuctionView($auction)
        {
            $viewBids = [];

            foreach ($auction -> bidderList as $bid)
            {
//                unset($bid['customerId']);

                // (mini encrypt() ToDo: richtig verschlüsseln - evtl. auch die MaxBids für späteren Gebrauch (KundenKonto)
//                $bid['customerId'] = $bid['customerId'];
                unset($bid['customerMaxBid']);

                array_push($viewBids, $bid);
            }
            $auction -> bidderList = $viewBids;

            if ($auction -> tense != "past-perfect")
            {
                $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);
            }

            return $auction;
        }

        public function calculateTense($startDate, $endDate) : string
        {
            $now = time();

            if ($startDate < $now && $endDate <= $now)
            {
                return 'past';
            }
            elseif ($startDate < $now && $endDate > $now)
            {
                return 'present';
            }
            elseif ($startDate > $now && $endDate > $now)
            {
                return 'future';
            }
            else
            {
                return 'Fehler - startDate: ' . $startDate . ' - endDate: ' . $endDate . ' - now: ' . $now;
            }
        }

        public function getAuctionsHelper()
        {
            $auctions = $this -> getValues(Auction_7::class);
            if ($auctions)
            {
                foreach ($auctions as $auction)
                {
                    if ($auction -> tense != "past-perfect")
                    {
                        $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);
                    }
                }
                unset($auction);

                return json_encode($auctions);
            }

            return false;
        }

        public function getAuctionForItemId($itemId)
        {
            if ($itemId > 0)
            {
                $auctionArray = $this -> getValues(Auction_7::class, ['itemId'], [$itemId]);
                $auction = (object) $auctionArray[0];
                if ($auction -> id)
                {
                    $auction = $this -> buildAuctionView($auction);

                    return $auction;
                }
            }

            return false;
        }

        /**
         * @param $tense
         * @return array|bool
         */
        public function getAuctionsForTense($tense)
        {
            $this -> getLogger(__METHOD__)
                  -> debug('PluginAuctions::auctions.debug', ['tenseTest' => $tense]);

            if ($tense)
            {
                $auctionArray = $this -> getValues(Auction_7::class, ['tense'], [$tense]);

                return $auctionArray;
            }
            return ['Fehler' => $tense];
        }

        /**
         * @param $auctionId
         * @return bool|mixed|string
         */
        public function getAuction($id)
        {
            if ($id > 0)
            {
                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
                    return $this -> buildAuctionView($auction);
                }
            }

            return 'falsche ID';
        }

        public function getBidderList($id)
        {
            if ($id > 0)
            {
                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
                    $auction = $this -> buildAuctionView($auction);

                    return $auction -> bidderList;
                }
            }

            return 'falsche ID in getBidderList';
        }

        /**
         * @param $id
         * @return string
         */
        public function getCurrentBidPrice($id)
        {
            if ($id > 0)
            {
                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
//                    $auction = $this -> buildAuctionView($auction);

//                    $newList = array (pluginApp(AuctionBidderListEntry::class));
//                    $newList = $auction -> bidderList;

                    $bidderListLastEntry = (object) array_pop(array_slice($auction -> bidderList, - 1));

                    return $bidderListLastEntry -> bidPrice;
                }

                return 'Fehler: keine gültige auction';
            }

            return 'Fehler: keine gültige ID';
        }

        public function getBidderListLastEntry($id)
        {
            if ($id > 0)
            {
                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
                    $bidderListLastEntry = array_pop(array_slice($auction -> bidderList, - 1));

                    unset($bidderListLastEntry['customerMaxBid']);

                    return $bidderListLastEntry;
                }

                return 'Fehler: keine gültige auction';
            }

            return 'Fehler: keine gültige ID';
        }

        /**
         * @param $newBackendAuction
         * @return bool|\Plenty\Modules\Plugin\DataBase\Contracts\Model
         */
        public function createAuction($newBackendAuction)
        {
            if ($newBackendAuction)
            {
                $auction = pluginApp(Auction_7::class);

                $auction -> itemId = (int) $newBackendAuction ['itemId'];
                $auction -> startDate = (int) $newBackendAuction ['startDate'];
                $auction -> startHour = (int) $newBackendAuction ['startHour'];
                $auction -> startMinute = (int) $newBackendAuction ['startMinute'];
                $auction -> auctionDuration = (int) $newBackendAuction ['auctionDuration'];
                $auction -> startPrice = (float) ($newBackendAuction ['startPrice']);

                $auction -> expiryDate = $auction -> startDate + ($auction -> auctionDuration * 24 * 60 * 60);

                $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);

                $auction -> createdAt = (int) time();

                $auction -> bidderList[0] = pluginApp(AuctionBidderListEntry::class);

                $auction -> bidderList[0] -> bidPrice = $auction -> startPrice - 1;
                $auction -> bidderList[0] -> customerMaxBid = $auction -> startPrice - 1;
                $auction -> bidderList[0] -> bidTimeStamp = $auction -> startDate;

                $auction -> updatedAt = $auction -> createdAt;

                return $this -> setValue($auction);
            }

            return false;
        }

        /**
         * @param $id
         * @param $updatedBackendAuction
         * @return bool|\Plenty\Modules\Plugin\DataBase\Contracts\Model|string
         */
        public function updateAuction($id, $updatedBackendAuction)
        {
            if ($updatedBackendAuction)
            {
                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
                    $auction -> startDate = $updatedBackendAuction ['startDate'];
                    $auction -> startHour = $updatedBackendAuction ['startHour'];
                    $auction -> startMinute = $updatedBackendAuction ['startMinute'];
                    $auction -> auctionDuration = $updatedBackendAuction ['auctionDuration'];
                    $auction -> startPrice = (float) ($updatedBackendAuction ['startPrice']);

                    $auction -> expiryDate = $auction -> startDate + ($auction -> auctionDuration * 24 * 60 * 60);

                    if ($auction -> tense != "past-perfect")
                    {
                        $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);
                    }

                    $auction -> updatedAt = time();

                    return $this -> setValue($auction);
                }

                return 'Diese ID: ' + $id + ' ist uns nicht bekannt';
            }

            return false;
        }

        public function updateAuctionAfterPlaceOrder($id)
        {
            if ($id)
            {
                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
                    $auction -> tense = "past-perfect";

                    $auction -> updatedAt = time();

                    return $this -> setValue($auction);
                }

                return 'Diese ID: ' + $id + ' ist uns nicht bekannt';
            }

            return false;
        }

        /**
         * @param $id
         * @param $newBi
         * @return bool|string
         */
        public function updateBidderList($id, $currentBid)
        {
            if ($currentBid)
            {
                $currentBid = (object) $currentBid;

                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
                    $newEntry = pluginApp(AuctionBidderListEntry::class);

                    $newList = array (pluginApp(AuctionBidderListEntry::class));
                    $newList = $auction -> bidderList;

                    $bidderListLastEntry = (object) array_pop(array_slice($newList, - 1));

//                    $loggedInUser = $this -> customerService -> getContactId();
//
//                    $this -> sessionStorage -> setSessionValue("customerBidId", $loggedInUser);
//                    $this -> sessionStorage -> setSessionValue("currentBid_customerId", $currentBid -> customerId);
//                    $this -> sessionStorage -> setSessionValue("bidderListLastEntry_customerId", $bidderListLastEntry -> customerId);

                    // ist eingeloggter Customer der Höchstbietende (letzte Bid CustomerId) ??
                    if ($currentBid -> customerId == $bidderListLastEntry -> customerId)
                    {
                        $newEntry -> bidPrice = $bidderListLastEntry -> bidPrice;
                        $newEntry -> customerMaxBid = $currentBid -> customerMaxBid;
                        $newEntry -> bidderName = $currentBid -> bidderName;
                        $newEntry -> customerId = $currentBid -> customerId;

                        $newEntry -> bidStatus = BidStatus::OWN_BID_CHANGED;

                    }
                    // anderer Customer !
                    else
                    {
                        // Neues Max-Gebot > Max-Gebot letzter Eintrag?
                        if ($currentBid -> customerMaxBid > $bidderListLastEntry -> customerMaxBid)
                        {
                            // Neues Max-Gebot < kleiner als letztes Max-Gebot +1  ??
                            if ($currentBid -> customerMaxBid < $bidderListLastEntry -> customerMaxBid + 1)
                            {
                                $newEntry -> bidPrice = $currentBid -> customerMaxBid;
                            }
                            // mehr als 1 EUR
                            else
                            {
                                $newEntry -> bidPrice = $bidderListLastEntry -> customerMaxBid + 1;
                            }
                            $newEntry -> customerMaxBid = $currentBid -> customerMaxBid;
                            $newEntry -> bidderName = $currentBid -> bidderName;
                            $newEntry -> customerId = $currentBid -> customerId;

                            $newEntry -> bidStatus = BidStatus::HIGHEST_BID;

                        }
                        else
                            // überboten
                        {
                            $newEntry -> bidPrice = $currentBid -> customerMaxBid;
                            $newEntry -> customerMaxBid = $bidderListLastEntry -> customerMaxBid;
                            $newEntry -> bidderName = $bidderListLastEntry -> bidderName;
                            $newEntry -> customerId = $bidderListLastEntry -> customerId;

                            $newEntry -> bidStatus = BidStatus::LOWER_BID;
                        }
                    }

                    $newEntry -> bidTimeStamp = time();

                    array_push($newList, $newEntry);

                    $auction -> bidderList = $newList;

                    $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);

                    if ($this -> setValue($auction))
                    {
                        return json_encode($auction -> tense);
                    }

                    return "Fehler in updateBidderList";
                }

                return 'Diese ID: ' + $id + ' ist uns nicht bekannt';
            }

            return $currentBid;
        }

        /**
         * @param $auctionId
         * @return bool|string
         */
        public function deleteAuction($id)
        {
            if ($id && $id > 0)
            {
                $auctionModel = pluginApp(Auction_7::class);
                $auctionModel -> id = $id;

                return json_encode($this -> deleteValue($auctionModel));
            }

            return 'Auctionsservice - delete Auction - Bedingung nicht erfüllt';
        }

    }