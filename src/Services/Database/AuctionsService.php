<?php

    namespace PluginAuctions\Services\Database;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use PluginAuctions\Models\Auction_7;
    use PluginAuctions\Models\Fields\AuctionBidderListEntry;

    //    use Illuminate\Support\Facades\App;
//    use Plenty\Modules\Plugin\DynamoDb\Contracts\DynamoDbRepositoryContract;


    class AuctionsService extends DataBaseService {


        protected $tableName = 'auctions';

        /**
         * AuctionsService constructor.
         * @param DataBase $dataBase
         */

        public function __construct(DataBase $dataBase)
        {
            parent ::__construct($dataBase);
        }

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
                unset($bid['customerId']);
                unset($bid['customerMaxBid']);

                array_push($viewBids, $bid);
            }
            $auction -> bidderList = $viewBids;

            $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);

            return $auction;
        }

//        /**
//         * @param $startDate
//         * @param $endDate
//         * @return string
//         */
        public function calculateTense($startDate, $endDate) : string
        {
            $now = time();

            if ($startDate < $now && $endDate < $now)
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
                    $auction = $this -> buildAuctionView($auction);

                    return $auction;
                }
            }

            return 'falsche ID';
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

                $auction -> itemId = $newBackendAuction ['itemId'];
                $auction -> startDate = $newBackendAuction ['startDate'];
                $auction -> startHour = $newBackendAuction ['startHour'];
                $auction -> startMinute = $newBackendAuction ['startMinute'];
                $auction -> auctionDuration = $newBackendAuction ['auctionDuration'];
                $auction -> startPrice = (float) ($newBackendAuction ['startPrice']);

                $auction -> expiryDate = $auction -> startDate + ($auction -> auctionDuration * 24 * 60 * 60);

                $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);

                $auction -> createdAt = time();

                $auction -> bidderList[0] = pluginApp(AuctionBidderListEntry::class);
                $auction -> bidderList[0] -> bidPrice = $auction -> startPrice;
                $auction -> bidderList[0] -> customerMaxBid = $auction -> startPrice - 1;

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

                    $auction -> tense = $this -> calculateTense($auction -> startDate, $auction -> expiryDate);

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
                $newBid = (object) $currentBid;

                $auction = $this -> getValue(Auction_7::class, $id);

                if ($auction instanceof Auction_7)
                {
                    $newList = array (pluginApp(AuctionBidderListEntry::class));
                    $newEntry = pluginApp(AuctionBidderListEntry::class);

                    $newList = $auction -> bidderList;

                    $bidderListLastEntry = end($auction -> bidderList);

                    $bidderListLastEntry -> customerId = $bidderListLastEntry -> customerId;

                    if ($bidderListLastEntry -> customerId == $newBid -> customerId)
                    {
                        //                     currentBid.bidPrice       = lastBidPrice;
                        //                     currentBid.customerMaxBid = newustomerMaxBid;
                        //ok
                        //                     currentBid.bidderName     = newBidderName;
                        //ok
                        //                     currentBid.customerId     = newUserId;
                        //ok
                        // return status eigenes Gebot ändern
                        $newBid -> bidStatus = "changedOwnBid";

                    }
                    else
                    {
                        if ($newBid -> customerMaxBid > $bidderListLastEntry -> customerMaxBid)
                        {
                            if ($newBid -> customerMaxBid < $bidderListLastEntry -> customerMaxBid + 1)
                            {
                                $newBid -> bidPrice = $newBid -> customerMaxBid;
                            }
                            else
                            {
                                $newBid -> bidPrice = $bidderListLastEntry -> customerMaxBid + 1;
                            }
                            //                         currentBid.customerMaxBid = newCustomerMaxBid;
                            //ok
                            //                         currentBid.bidderName     = newBidderName;
                            //ok
                            //                         currentBid.customerId     = newUserId;
                            //ok

                            // return status GLÜCKWUNSCH<br>Sie sind jetzt der Höchstbietende
                            $newBid -> bidStatus = "highestBid";

                        }
                        else
                        {
                            //                         currentBid.bidPrice       = newCustomerMaxBid;
                            //ok
                            //                         currentBid.customerMaxBid = lastCustomerMaxBid;
                            $newBid -> customerMaxBid = $bidderListLastEntry -> customerMaxBid;
                            //                         currentBid.bidderName     = bidderListLastEntry.bidderName;
                            $newBid -> bidderName = $auction -> bidderList -> bidderName;
                            //                         currentBid.customerId     = lastUserId;
                            $newBid -> customerMaxBid = $bidderListLastEntry -> customerId;

                            // return status  Es gibt leider schon ein höheres Gebot...
                            $newBid -> bidStatus = "lowerBid";
                        }
                    }


                    $newEntry -> bidderName = $newBid -> bidderName;
                    $newEntry -> customerId = $newBid -> customerId;
                    $newEntry -> customerMaxBid = $newBid -> customerMaxBid;


                    $newEntry -> bidPrice = $newBid -> bidPrice;
                    $newEntry -> bidStatus = $newBid -> bidStatus;
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

            return false;
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