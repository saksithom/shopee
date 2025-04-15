<?php 

namespace App\Helper;

use App\Models\Apis;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Concerns\WithHeadings;

class APIShopee 
{
    protected $shopee_api_link = 'https://open-api.affiliate.shopee.co.th/graphql';
    protected $shopee_app_id;
    protected $shopee_app_secret;
    public function __construct()
    {
        $shopee = Apis::where('api_type','shopee')->first();
        if(!$shopee)
            abort(401, 'shopee Unauthorized');
        
        $this->shopee_app_id = $shopee->app_id;
        $this->shopee_app_secret = $shopee->secret_id;

    }

    public function makeSignature($textQuery,$timestamps)
    {
        $factor = $this->shopee_app_id . $timestamps . json_encode($textQuery) . $this->shopee_app_secret;
        return hash_hmac('sha256',$factor, $this->shopee_app_secret);
    }

    public function getProducts($query = null, $limit = 50, $page = 1)
    {
        $querys = [];
        if(isset($query['itemId']))
            $querys[] = "itemId: {$query['itemId']}";

        if(isset($query['keyword'])){
            $querys[] = "keyword: \"{$query['keyword']}\"";
            // $querys[] = "isAMSOffer: true";
            // $querys[] = "isKeySeller: true";
        }
        if(isset($query['shopId']))
            $querys[] = "shopId: {$query['shopId']}";

        if(isset($query['productCatId']))
            $querys[] = "productCatId: {$query['productCatId']}";

        $graphQLParams = [
                'query' => '{
                    productOfferV2('
                        . 'limit: '. intval($limit) .', '
                        . 'sortType: 1, listType: 2, '
                        . 'page: '. intval($page) .', '
                        . ( $querys ? implode(', ',$querys) : '' )
                    .'){
                        nodes {
                            productName
                            itemId
                            commissionRate
                            commission
                            price
                            sales
                            imageUrl
                            shopName
                            productLink
                            offerLink
                            periodStartTime
                            periodEndTime
                            priceMin
                            priceMax
                            productCatIds
                            ratingStar
                            priceDiscountRate
                            shopId
                            shopType
                            sellerCommissionRate
                            shopeeCommissionRate
                        }
                        pageInfo {
                            page
                            limit
                            hasNextPage
                            scrollId
                        }
                    }
                }'
        ];
        return $this->query($graphQLParams);

    }
    public function shopOffer($querys = '')
    {
        $graphQLParams = [
            'query' => '{
                shopOfferV2('. ($querys ? $querys : '') .'){
                        nodes {
                            commissionRate
                            imageUrl
                            offerLink
                            originalLink
                            shopId
                            shopName
                            periodStartTime
                            periodEndTime
                            bannerInfo{
                                count
                                banners{
                                    fileName
                                    imageHeight
                                    imageWidth
                                    imageSize
                                    imageUrl
                                }
                            }
                            ratingStar
                            shopType
                            remainingBudget
                            sellerCommCoveRatio
                    }
                    pageInfo {
                        page
                        limit
                        hasNextPage
                        scrollId
                    }
                }
            }'
        ];
        return $this->query($graphQLParams);
    }

    public function getReports($query = '')
    {
        $graphQLParams = [
            'query' => '{
                conversionReport('
                    . ( $query ? $query : '')
                .'){
                    nodes {
                        clickTime
                        purchaseTime
                        conversionId
                        shopeeCommissionCapped
                        sellerCommission
                        totalCommission
                        netCommission
                        mcnManagementFeeRate
                        mcnManagementFee
                        mcnContractId
                        linkedMcnName
                        buyerType
                        utmContent
                        device
                        productType
                        referrer
                        orders {
                            orderId
                            orderStatus
                            shopType
                            items{
                                shopId
                                shopName
                                completeTime
                                itemId
                                itemName
                                itemPrice
                                displayItemStatus
                                actualAmount
                                qty
                                imageUrl
                                itemTotalCommission
                                itemSellerCommission
                                itemSellerCommissionRate
                            }
                        }
                    }
                    pageInfo {
                        page
                        limit
                        hasNextPage
                        scrollId
                    }
                }
            }'
        ];
        return $this->query($graphQLParams);
    }
    public function getCommissionReport($query = '')
    {
        $graphQLParams = [
            'query' => '{
                validatedReport('
                    . ( $query ? $query : '')
                .'){
                    nodes {
                        clickTime
                        purchaseTime
                        conversionId
                        shopeeCommissionCapped
                        sellerCommission
                        totalCommission
                        buyerType
                        utmContent
                        device
                        productType
                        referrer
                        netCommission
                        mcnManagementFeeRate
                        mcnManagementFee
                        mcnContractId
                        linkedMcnName
                        orders{
                            orderId
                            shopType
                            orderStatus
                            items{
                                itemId
                                itemName
                                qty
                                itemPrice
                                imageUrl
                            }
                        }
                    }
                    pageInfo {
                        page
                        limit
                        hasNextPage
                        scrollId
                    }
                }
            }'
        ];
        return $this->query($graphQLParams);
    }

    public function query($graphQLParams)
    {
        // $client = new Client(['base_uri' => $this->shopee_api_link]);
        // Get current timestamp
        $ts = time();
        // Convert parameters to JSON
        $payload = json_encode($graphQLParams);
        // Generate the signature
        $factor = $this->shopee_app_id . $ts . $payload . $this->shopee_app_secret;
        $sign = hash('sha256', $factor);
        // Set up headers
        $headers = [
            'Content-Type' => 'application/json',
            'Authorization' => "SHA256 Credential={$this->shopee_app_id}, Timestamp={$ts}, Signature={$sign}"
        ];
        // Send the request
        $response = Http::withHeaders($headers)
                    ->post($this->shopee_api_link,$graphQLParams);
                    /* [
            'headers' => $headers,
            'body' => $payload,
        ]);
        */
        // Decode and return the JSON response
        return $response->json();
    }

}