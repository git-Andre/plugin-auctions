<?php

    namespace PluginAuctions\Services\Database;

//    use IO\Services\CustomerService;
//    use IO\Services\SessionStorageService;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use Plenty\Plugin\Log\Loggable;
    use PluginAuctions\Constants\AuctionStatus;
    use PluginAuctions\Models\Auction_7;
    use PluginAuctions\Models\VisitorCounter_1;


    class VisitorCounterService extends DataBaseService {

        use Loggable;

        public function __construct(DataBase $dataBase)
        {
            parent ::__construct($dataBase);
        }

        public function increaseVisitorCounterForItemId(int $itemId)
        {
            if ($itemId > 0)
            {
                $visitorCounter = $this -> getVisitorCounterForItemId($itemId);

                if ($visitorCounter instanceof VisitorCounter_1)
                {
                    $visitorCounter -> visitorCounter = $visitorCounter -> visitorCounter + 1;
                    $visitorCounter -> updatedAt = time();

                    $resultCounter = $this -> setValue($visitorCounter);

                    $this -> getLogger(__METHOD__)
                          -> setReferenceType('auctionId')
                          -> setReferenceValue($itemId)
                          -> debug('PluginAuctions::auctions.debug', ['resultCounter++: ' => $resultCounter]);

                    return $resultCounter;
                }
                return 'Diese itemID: ' + $itemId + ' ist uns nicht bekannt';
            }
            return false;
        }

        public function getVisitorCounterForItemId(int $itemId)
        {
            if ($itemId > 0)
            {
                $counterArray = $this -> getValues(VisitorCounter_1::class, ['itemId'], [$itemId]);
                $visitorCounter = (object) $counterArray[0];
                if ($visitorCounter instanceof VisitorCounter_1)
                {
                    return $visitorCounter;
                }
            }

            return false;
        }

        public function getCounterForItemId(int $itemId) : int
        {
            if ($itemId > 0)
            {
                $visitorCounter = $this -> getVisitorCounterForItemId($itemId);

                if ($visitorCounter instanceof VisitorCounter_1)
                {
                    $counter = $visitorCounter -> visitorCounter;

                    $this -> getLogger(__METHOD__)
                          -> setReferenceType('auctionId')
                          -> setReferenceValue($itemId)
                          -> debug('PluginAuctions::auctions.debug', ['counter: ' => $counter]);

                    return $counter;
                }
                return 'Diese itemID getCounter: ' + $itemId + ' ist uns nicht bekannt';
            }
            return false;
        }

        /**
         * @param int $itemId
         * @return bool|\Plenty\Modules\Plugin\DataBase\Contracts\Model
         */
        public function createVisitorCounter(int $itemId)
        {
            if ($itemId > 0)
            {
                $counter = pluginApp(VisitorCounter_1::class);

                $counter -> itemId = $itemId;
                $counter -> visitorCounter = 1;
                $counter -> updatedAt = (int) time();

                $resultCounter = $this -> setValue($counter);

                $this -> getLogger(__METHOD__)
                      -> setReferenceType('auctionId')
                      -> setReferenceValue($itemId)
                      -> debug('PluginAuctions::auctions.debugAfter', ['resultCounter: ' => $resultCounter]);

                return $resultCounter;
            }

            return false;
        }

//        public function getFormattedVisitorCounterForItemId(int $itemId) : array
//        {
//            if ($itemId > 0)
//            {
//                $visitorCounter = $this -> getVisitorCounterForItemId($itemId);
//
//                if ($visitorCounter instanceof VisitorCounter_1)
//                {
//                    $counter = $visitorCounter -> visitorCounter;
//
//                    $formattedCounterArray = [0,0,0,2,3];
//
//                    $this -> getLogger(__METHOD__)
//                          -> setReferenceType('auctionId')
//                          -> setReferenceValue($itemId)
//                          -> debug('PluginAuctions::auctions.debug', ['FORMATTED: ' => $formattedCounterArray]);
//
//                    return $formattedCounterArray;
//                }
//                return 'Diese itemID: ' + $itemId + ' ist uns nicht bekannt';
//            }
//            return false;
//        }

    }