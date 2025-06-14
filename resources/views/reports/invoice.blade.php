<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Quotation report</title>
        <style>
            @font-face {
                font-family: 'Roboto';
                src: url('{{ storage_path("fonts/Roboto-Regular.ttf") }}') format('truetype');
                font-weight: normal;
                font-style: normal;
            }

            body {
                margin: 0px;
                padding: 0px;
                font-family: 'Roboto', sans-serif;
                font-size: 12px;
            }

            table.tbldetail {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }

            table.tbldetail th,
            table.tbldetail td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
            }
            table.tbldetail th {
                background-color: #f2f2f2;
            }


            .pnl-head-01 {
                background-color: #eaecee;
                padding: 5px 10px;
                border-bottom: 3px solid #f6ddcc;
            }

            .title01{
                font-size: 150%;
                color: #4773d1
            }

            .text-color1{
                color: #233244;
            }

            .text-color2{
                color: #ce0021;
            }

            .fw-bold{
                font-weight: bold;
            }

            .f-size01{
                font-size: 110%;
            }

            .pnl-logo{
                text-align: center;
                padding: 10px;
                background-color: #e2e0e0;
                border-radius: 5px;
            }

            .f-size02{
                font-size: 120%;
            }

            .f-size07{
                font-size: 170%;
            }

            hr {
                background-color: #bfc9ca;
                margin: 0px;
                height: 10px;
                border: none;
            }

            .pnl-head-02,
            .pnl-head-03 {
                padding: 5px 10px;
            }

            .p-0{
                padding: 0 !important;
            }

            .m-0{
                margin: 0 !important;
            }

            .mt-1{
                margin-top: 1rem !important;
            }

            .w50 {
                width: 50%;
            }

            .w100 {
                width: 100%;
            }

            .float-r {
                float: right;
            }

            .float-l {
                float: left;
            }

            .bg1 {
                background-color: red;
            }

            .bg2 {
                background-color: green;
            }

            .d-inline-block {
                display: inline-block;
            }

            .logo-panel {
                text-align: center;
            }

            .logo01 {
                width: 150px;
            }

            table.table01 {
                border-collapse: collapse;
            }

            table.table01 th, table.table01 td{
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #6a6969; /* solo borde inferior */
            }
        </style>
    </head>
    <body>
        <div class="pnl-head-01">
            <div class="w100">
                <table style="border: none; width: 100%;">
                    <tr>
                        <td style="border: none">

                            <div class="title01"><img src="{{ public_path('images/company.png') }}" style="width: 20px;" alt=""> Company</div>
                            <div>
                                <p class="m-0 fw-bold f-size02 text-color1">{{ $companyConfig->company_name }}</p>
                                <p class="m-0 f-size01">{{ $companyConfig->address }}</p>
                                <p class="m-0 f-size01">{{ $companyConfig->phone }}</p>
                            </div>


                            <div style="margin-top: 50px;"class="title01"><img src="{{ public_path('images/target.png') }}" style="width: 20px;" alt=""> Customer</div>
                            <div>
                                <p class="m-0 fw-bold f-size02 text-color1">{{ $invoiceHead->customer->first_name}} {{ $invoiceHead->customer->middle_name}} {{ $invoiceHead->customer->last_name}}</p>
                                <p class="m-0 f-size01">{{ $invoiceHead->customer->address }}</p>
                                <p class="m-0 f-size01">{{ $invoiceHead->customer->phone }}</p>
                            </div>
                        </td>
                        <td style="text-align: right; border: none">
                            <div class="pnl-logo">
                                <img
                                    class="logo01"
                                    style="border: 3px solid #ffffff;"
                                    src="{{ public_path('images/logo.jpg') }}"
                                    alt=""
                                />
                                <div>
                                    <p class="m-0">{{ $companyConfig->website}}</p>
                                </div>
                            </div>
                            <div style="text-align: right;" class="mt-1">
                                <p class="m-0 fw-bold f-size02 text-color1">Quotation</p>
                                <p class="m-0 text-color2 f-size07 fw-bold">No. {{ $invoiceHead->id }}</p>
                                <p class="m-0 m-0 mt-1 fw-bold f-size02 text-color1">Quote valid until:</p>
                                <p class="m-0">{{ $invoiceHead->expiration_date->format('Y-m-d')}}</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <hr />

        <div class="pnl-head-03">
            <h2 class="text-color1">List of quoted services</h2>
            <table class="tbldetail">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Unit price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($invoiceDtl as $i => $invoice)
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>{{ $invoice['category']['name'] }}</td>
                        <td>{{ $invoice['description'] }}</td>
                        <td>{{ $invoice['unit_price'] }}</td>
                        <td>{{ $invoice['quantity'] }}</td>
                        <td>{{ $invoice['total_amount'] }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div style="text-align: right;">
                <div style="display: inline-block; margin-top: 20px;">
                <table style="max-width: 500px;" class="table01">
                    <tr>
                        <td>Sub Total</td>
                        <td>$ {{ $invoiceHead->subtotal }}</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td>$ {{ $invoiceHead->total }}</td>
                    </tr>
                    <tr>
                        <td>Amount paid</td>
                        <td>$ {{ $invoiceHead->amount_paid }}</td>
                    </tr>
                    <tr>
                        <td>Balance due</td>
                        <td>$ {{ $invoiceHead->balance_due }}</td>
                    </tr>
                </table>
                </div>
            </div>
        </div>
    </body>
</html>
