<?php //strict

namespace PluginAuctions\Builder\Order;

use IO\Services\SessionStorageService;
use Plenty\Modules\Basket\Models\Basket;
use Plenty\Modules\Basket\Models\BasketItem;
use IO\Services\CheckoutService;
use Plenty\Modules\Frontend\PaymentMethod\Contracts\FrontendPaymentMethodRepositoryContract;
use Plenty\Modules\Frontend\Services\VatService;
use IO\Builder\Order\OrderItemType;

/**
 * Class OrderItemBuilder
 * @package IO\Builder\Order
 */
class AuctionOrderItemBuilder
{
//	/**
//	 * @var CheckoutService
//	 */
//	private $checkoutService;
//
//    /**
//     * @var VatService
//     */
//	private $vatService;
//
//	/**
//	 * OrderItemBuilder constructor.
//	 * @param CheckoutService $checkoutService
//	 */
//	public function __construct(CheckoutService $checkoutService, VatService $vatService)
//	{
//		$this->checkoutService = $checkoutService;
//		$this->vatService = $vatService;
//	}
//
//	/**
//	 * Add a basket item to the order
//	 * @param Basket $basket
//	 * @param array $items
//	 * @return array
//	 */
//	public function fromBasket(Basket $basket, array $items):array
//	{
//		$currentLanguage = pluginApp(SessionStorageService::class)->getLang();
//		$orderItems      = [];
//		foreach($basket->basketItems as $basketItem)
//		{
//			//$basketItemName = $items[$basketItem->variationId]->itemDescription->name1;
//			$basketItemName = '';
//			foreach($items as $item)
//			{
//				if($basketItem->variationId == $item['variationId'])
//				{
//                    $basketItemName = $item['variation']['data']['texts']['name1'];
//				}
//			}
//
//			array_push($orderItems, $this->basketItemToOrderItem($basketItem, (STRING)$basketItemName));
//		}
//
//
//		// add shipping costs
//        $shippingCosts = [
//            "typeId"        => OrderItemType::SHIPPING_COSTS,
//            "referrerId"    => $basket->basketItems->first()->referrerId,
//            "quantity"      => 1,
//            "orderItemName" => "shipping costs",
//            "countryVatId"  => $this->vatService->getCountryVatId(),
//            "vatRate"       => 0, // FIXME get vat rate for shipping costs
//            "amounts"       => [
//                [
//                    "currency"              => $this->checkoutService->getCurrency(),
//                    "priceOriginalGross"    => $basket->shippingAmount
//                ]
//            ]
//        ];
//        array_push($orderItems, $shippingCosts);
//
//		$paymentFee = pluginApp(FrontendPaymentMethodRepositoryContract::class)
//			->getPaymentMethodFeeById($this->checkoutService->getMethodOfPaymentId());
//
//		$paymentSurcharge = [
//			"typeId"        => OrderItemType::PAYMENT_SURCHARGE,
//			"referrerId"    => $basket->basketItems->first()->referrerId,
//			"quantity"      => 1,
//			"orderItemName" => "payment surcharge",
//			"countryVatId"  => $this->vatService->getCountryVatId(),
//			"vatRate"       => 0, // FIXME get vat rate for shipping costs
//			"amounts"       => [
//				[
//					"currency"           => $this->checkoutService->getCurrency(),
//					"priceOriginalGross" => $paymentFee
//				]
//			]
//		];
//		array_push($orderItems, $paymentSurcharge);
//
//
//		return $orderItems;
//	}
//
//	/**
//	 * Add a basket item to the order
//	 * @param BasketItem $basketItem
//	 * @param string $basketItemName
//	 * @return array
//	 */
	private function basketItemToOrderItem(BasketItem $basketItem, string $basketItemName):array
	{

		return [
			"typeId"            => OrderItemType::VARIATION,
			"referrerId"        => $basketItem->referrerId,
			"itemVariationId"   => $basketItem->variationId,
			"quantity"          => $basketItem->quantity,
			"orderItemName"     => $basketItemName,
			"shippingProfileId" => $basketItem->shippingProfileId,
			"countryVatId"      => $this->vatService->getCountryVatId(),
			"vatRate"           => $basketItem->vat,
			//"vatField"			=> $basketItem->vatField,// TODO
            "orderProperties"   => $basketItemProperties,
			"amounts"           => [
				[
					"currency"           => $this->checkoutService->getCurrency(),
					"priceOriginalGross" => $priceOriginal,
                    "surcharge" => $attributeTotalMarkup,
					"rebate"	=> $rebate,
					"isPercentage" => 1
				]
			]
		];
	}

}
