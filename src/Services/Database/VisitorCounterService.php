<?php

    namespace PluginAuctions\Services\Database;

//    use IO\Services\CustomerService;
//    use IO\Services\SessionStorageService;

    use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
    use Plenty\Plugin\Log\Loggable;
    use PluginAuctions\Models\VisitorCounter_1;


    class VisitorCounterService extends DataBaseService {

        use Loggable;

        // VisitorCounter = Class / numberOfVisitors = int number of visitors

        public function __construct(DataBase $dataBase)
        {
            parent ::__construct($dataBase);
        }

        public function getVisitorCounters()
        {
            $visitorCounters = $this -> getValues(VisitorCounter_1::class);
            if ($visitorCounters)
            {
                return $visitorCounters;
            }

            return 'Fehler getVisitorCounters';
        }

        public function increaseNumberOfVisitorsForItemId(int $itemId) : int
        {
            if ($itemId > 0)
            {
                $visitorCounter = $this -> getVisitorCounterForItemId($itemId);

                if ($visitorCounter instanceof VisitorCounter_1)
                {
                    $visitorCounter -> numberOfVisitors = $visitorCounter -> numberOfVisitors + 1;
                    $visitorCounter -> updatedAt = time();

                    $resultVisitorCounter = $this -> setValue($visitorCounter);

                    $this -> getLogger(__METHOD__)
                          -> setReferenceType('auctionId')
                          -> setReferenceValue($itemId)
                          -> debug('PluginAuctions::auctions.debug', ['resultCounter++: ' => $resultVisitorCounter]);

                    return $visitorCounter -> numberOfVisitors;
                }

                return - 1;
            }

            return - 2;
        }

        /**
         * @param int $itemId
         * @return bool|object
         */
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

        /**
         * @param int $itemId
         * @return int
         */
        public function getNumberOfVisitorsForItemId(int $itemId) : int
        {
            if ($itemId > 0)
            {
                $visitorCounter = $this -> getVisitorCounterForItemId($itemId);

                if ($visitorCounter instanceof VisitorCounter_1)
                {
                    $this -> getLogger(__METHOD__)
                          -> setReferenceType('auctionId')
                          -> setReferenceValue($itemId)
                          -> debug('PluginAuctions::auctions.debug', ['numberOfVisitors: ' => $visitorCounter -> numberOfVisitors]);

                    return $visitorCounter -> numberOfVisitors;
                }

                return - 1;
            }

            return - 2;
        }

        /**
         * @param int $itemId
         * @return bool|\Plenty\Modules\Plugin\DataBase\Contracts\Model
         */
        public function createVisitorCounter(int $itemId)
        {
            if ($itemId > 0)
            {
                $isThereAlreadyACounterForItemId = $this -> getVisitorCounterForItemId($itemId) instanceof VisitorCounter_1;

                if ( ! $isThereAlreadyACounterForItemId)
                {
                    $visitorCounter = pluginApp(VisitorCounter_1::class);

                    $visitorCounter -> itemId = $itemId;
                    $visitorCounter -> numberOfVisitors = 1;
                    $visitorCounter -> updatedAt = (int) time();

                    $resultVisitorCounter = $this -> setValue($visitorCounter);

                    $this -> getLogger(__METHOD__)
                          -> setReferenceType('auctionId')
                          -> setReferenceValue($itemId)
                          -> debug('PluginAuctions::auctions.debugAfter', ['resultCounter: ' => $resultVisitorCounter]);

                    return $resultVisitorCounter;
                }

                $this -> getLogger(__METHOD__)
                      -> setReferenceType('testedId')
                      -> setReferenceValue($itemId)
                      -> debug('PluginAuctions::auctions.debug', ['$isThereAlreadyACounterForItemId: ' => $isThereAlreadyACounterForItemId]);

                return $this -> increaseNumberOfVisitorsForItemId($itemId);
            }

            return 'Id ???';
        }

//        public function getFormattedVisitorCounterForItemId(int $itemId) : array
//        {
//            if ($itemId > 0)
//            {
//                $visitorCounter = $this -> getVisitorCounterForItemId($itemId);
//
//                if ($visitorCounter instanceof VisitorCounter_1)
//                {
//                    $visitorCounter = $visitorCounter -> visitorCounter;
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