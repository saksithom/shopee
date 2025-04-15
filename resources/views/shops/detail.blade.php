@extends('layouts.app')

@section('title', $shop->name . ' - Shopee Affiliates')
@section('meta_description', 'ข้อมูลร้านค้า ' . $shop->name . ' บน Shopee Affiliates')
@section('meta_keywords', $shop->name . ', Shopee, Affiliates, ร้านค้า')

@section('content')
<h1>{{ $shop->name }}</h1>
<img src="{{ $shop->logo }}" alt="{{ $shop->name }}">
<p>{{ $shop->description }}</p>
<h2>สินค้าในร้าน</h2>
<div class="products">
    @foreach($shop->products as $product)
        <div class="product">
            <a href="{{ route('product.detail', $product->id) }}">
                <img src="{{ $product->image }}" alt="{{ $product->name }}">
                <h3>{{ $product->name }}</h3>
            </a>
        </div>
    @endforeach
</div>
@endsection
@section('scripts')
    <script type="application/ld+json">
        {
            "@context": "https://schema.org/",
            "@type": "Store",
            "name": "{{ $shop->name }}",
            "image": "{{ $shop->logo }}",
            "description": "{{ $shop->description }}",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "{{ $shop->address }}",
                "addressLocality": "{{ $shop->city }}",
                "addressRegion": "{{ $shop->region }}",
                "postalCode": "{{ $shop->postal_code }}",
                "addressCountry": "TH"
            }
        }
    </script>
@endsection
