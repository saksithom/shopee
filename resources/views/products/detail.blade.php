@extends('layouts.app')

@section('title', $product->productName . ' - ชี้เป้า สินค้า Shopee ')
@section('meta_description', $product->productName)
@section('meta_keywords', $product->productName . ', Shopee, โปรโมทสินค้า')

@section('content')
<div class="container mt-5">
    <div class="row">
        <!-- Product Images -->
        <div class="col-md-6 mb-4">
            <img src="{{ $product->imageUrl }}" alt="{{ $product->productName }}" class="img-fluid rounded mb-3 product-image">
        </div>

        <!-- Product Details -->
        <div class="col-md-6">
            <h2 class="mb-3">{{ $product->productName }}</h2>
            <div class="mb-3">
                <span class="h5 mb-0">ราคา {{nb((int)$product->price)}} ฿.</span>
                {{-- <span class="text-muted"><s>$399.99</s></span> --}}
            </div>
            <div class="mb-3">
                {!! RatingStars($product->ratingStar) !!}
                <span class="ms-2">{{ $product->ratingStar }}</span>
            </div>
            <p>อัพเดทล่าสุด {{ date('d/m/Y H:i',strtotime($product->updated_at)) }}</p>

            {{-- <a href="{{url('product/'. $item->itemId) }}" class="btn btn-primary btn-sm"><i class="fa fa-search"></i></a> --}}
            <a href="{{ $product->offerLink }}" target="_blank" class="btn btn-outline-warning btn-sm">พิกัดสินค้า</a>

        </div>
    </div>
</div>
@endsection
@section('scripts')
    <script type="application/ld+json">
        {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "{{ $product->productName }}",
            "image": "{{ $product->imageUrl }}",
            "offers": {
                "@type": "Offer",
                "price": "{{ $product->price }}",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "url": "{{ $product->offerLink }}"
            }
        }
    </script>
@endsection