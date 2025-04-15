<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark px-2">
    <a class="navbar-brand" href="#">
        
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse p-2" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/">รายการสินค้า</a>
            </li>
            <li class="nav-item">
                {{-- <a class="nav-link" href="/shop-offers">ร้านค้า</a> --}}
            </li>
        </ul>
        <form class="d-flex" method="GET" action="{{url('/search')}}">
            <input class="form-control me-2" type="search" placeholder="ค้าหาสินค้า/ร้านค้า" aria-label="Search" name="term" />
            <button class="btn btn-outline-light" type="submit">ค้นหา</button>
        </form>
    </div>
</nav>
<!-- End Navbar -->