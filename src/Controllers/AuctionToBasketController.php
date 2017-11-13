<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Modules\Basket\Contracts\BasketItemRepositoryContract;
    use Plenty\Modules\Basket\Models\BasketItem;
    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;
    use Plenty\Plugin\Log\Loggable;
    use PluginAuctions\Services\Database\AuctionsService;


    class AuctionToBasketController extends Controller {

        use Loggable;

        public function add(Request $request, BasketItemRepositoryContract $basketItemRepository, AuctionsService $auctionsService)
        {
            $data['variationId'] = $request -> get('number', '');
            $data['quantity'] = 1;

            $auctionId = $request -> get('auctionid', '');

            $lastBidPrice = (double)$auctionsService -> getCurrentBidPrice($auctionId);

            $basketItem = $basketItemRepository -> findExistingOneByData($data);

            if ($basketItem instanceof BasketItem)
            {
//                $data['id'] = $basketItem -> id;
////                $data['quantity'] = (int) $data['quantity'] + $basketItem -> quantity;
//                $basketItemRepository -> updateBasketItem($basketItem -> id, $data);
//
                $this -> getLogger(__METHOD__)
                      -> setReferenceType('auctionVarId')
                      -> setReferenceValue($data['variationId'])
                      -> debug('PluginAuctions::Template.basketItemAlreadyInBasket', ['$basketItem: ' => $basketItem]);

                return json_encode($basketItem);
            }
            else
            {
                try
                {
                    $data['shippingProfileId'] = 34; // ToDo: von config holen
                    $data['referrerId'] = 9;
                    $data['price'] = 33.33; // $lastBidPrice + $lastBidPrice * 0.1; // ToDo: Aufgeld von config
                    $data['givenPrice'] = 22.22;
                    $data['useGivenPrice'] = true;
//                    $data['variation']['data']['calculatedPrices']['default']['basePrice'] = [11.11];
//                    $data['variation']['data']['calculatedPrices']['default']['basePriceNet'] = 11.10;

                    $basketItemRepository -> addBasketItem($data);

                    $this -> getLogger(__METHOD__)
                          -> setReferenceType('auctionVarId')
                          -> setReferenceValue($data['variationId'])
                          -> debug('PluginAuctions::Template.basketItemAdded', ['$data: ' => $data]);

                    return json_encode($data['variationId']);
                }
                catch ( \Exception $exc )
                {
                    return json_encode($request);
                }

            }
        }

//    public function findItemByNumber($number)
//    {
//        $variationId = $number;
//
//        if(strlen($number))
//        {
//            $app = pluginApp(Application::class);
//
//            $documentProcessor = pluginApp(DocumentProcessor::class);
//            $documentSearch = pluginApp(DocumentSearch::class, [$documentProcessor]);
//
//            $elasticSearchRepo = pluginApp(VariationElasticSearchSearchRepositoryContract::class);
//            $elasticSearchRepo->addSearch($documentSearch);
//
//            $clientFilter = pluginApp(ClientFilter::class);
//            $clientFilter->isVisibleForClient($app->getPlentyId());
//
//            $variationFilter = pluginApp(VariationBaseFilter::class);
//            $variationFilter->isActive();
//            $variationFilter->hasNumber($number, ElasticSearch::SEARCH_TYPE_EXACT);
//
//            $documentSearch
//                ->addFilter($clientFilter)
//                ->addFilter($variationFilter);
//
//            $result = $elasticSearchRepo->execute();
//
//            if(count($result['documents']))
//            {
//                $variationId = $result['documents'][0]['data']['variation']['id'];
//            }
//        }
//
//        return $variationId;
//    }

    }