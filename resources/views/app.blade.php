<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    {{-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> --}}
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>{{ env('APP_NAME','Affiliate Sharring Programs') }}</title>
    <link rel="stylesheet" href="{{ mix('css/light-bootstrap-dashboard-react.css') }}">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    <meta name="robots" content="noindex, nofollow">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
</head>
<body>
    <div id="app"></div>
    <script src="{{ mix('js/index.js') }}"></script>
</body>
</html>
