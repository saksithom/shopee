@extends('layouts.app')

@section('title', 'ชี้เป้า Shopee')
@section('meta_description', 'ค้นหาสินค้าที่น่าสนใจจาก Shopee  พร้อมโปรโมชั่นและส่วนลดมากมาย')
@section('meta_keywords', 'Shopee, โปรโมทสินค้า, ส่วนลด, โปรโมชั่น')

@section('content')
<h1>สินค้าหน้าร้าน</h1>
<div class="row g-4">
    @foreach ($products as $item)
    <div class="col-md-4">
        <div class="card">

            <a href="{{url('product/'. $item->itemId) }}"><img src="{{$item->imageUrl}}" class="card-img-top" alt="{{ $item->productName }}"></a>
            <div class="card-body">
                <h5 class="card-title">{{$item->productName}}</h5>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="h5 mb-0">ราคา {{nb((int)$item->price)}} ฿.</span>
                    {!! RatingStars($item->ratingStar) !!}
                </div>
                <p>อัพเดทล่าสุด {{ date('d/m/Y H:i',strtotime($item->updated_at)) }}</p>
            </div>
            <div class="card-footer d-flex justify-content-between bg-light">
                <a href="{{url('product/'. $item->itemId) }}" class="btn btn-primary btn-sm"><i class="fa fa-search"></i></a>
                <a href="{{ $item->offerLink }}" target="_blank" class="btn btn-outline-warning btn-sm">พิกัดสินค้า</a>
            </div>
        </div>
    </div>
    @endforeach
</div>
<div class="">
    {!! $products->links('pagination::bootstrap-5') !!}
</div>
@endsection