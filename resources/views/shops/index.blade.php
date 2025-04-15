@extends('layouts.app')

@section('title', 'ชี้เป้า ร้านค้า Shopee ')
@section('meta_description', 'ร้านค้า Shopee')
@section('meta_keywords', 'Shopee, โปรโมทสินค้า')

@section('content')
<div class="container mt-5">
    @foreach($shops as $shop)
    <pre>
    </pre>
    {{ $shop->shopName}} <br/>
    @endforeach
</div>
@endsection
