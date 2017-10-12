<?php

    namespace PluginAuctions\Controllers;

    use Plenty\Modules\Basket\Contracts\BasketItemRepositoryContract;
    use Plenty\Modules\Basket\Models\BasketItem;
    use Plenty\Plugin\Controller;
    use Plenty\Plugin\Http\Request;

    class AuctionToBasketController extends Controller {

        public function add(Request $request, BasketItemRepositoryContract $basketItemRepository)
        {
            $data['variationId'] = $request -> get('number', '');
            $data['quantity'] = 1;

            $basketItem = $basketItemRepository -> findExistingOneByData($data);
            if ($basketItem instanceof BasketItem)
            {
                $data['id'] = $basketItem -> id;
//                $data['quantity'] = (int) $data['quantity'] + $basketItem -> quantity;
                $basketItemRepository -> updateBasketItem($basketItem -> id, $data);
                return json_encode($basketItem);
            }
            else
            {
                try
                {
                    $basketItemRepository -> addBasketItem($data);
                    return json_encode($basketItemRepository);
                }
                catch ( \Exception $exc )
                {
                    return json_encode($exc);
                }
            }

        return json_encode($data);
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