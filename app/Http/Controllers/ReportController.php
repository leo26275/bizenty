<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\User; // remove
use App\Models\Quotation;
use App\Models\QuotationDtl;
use App\Models\Invoice;
use App\Models\InvoiceDtl;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;



class ReportController extends Controller
{
    public function downloadQuote($quotation_id){
        $company_id = Auth::user()->company_id;

        $quotationHead = Quotation::where('id', $quotation_id)->with('customer')->first();
        $quotationDtl = QuotationDtl::where('quotation_id', $quotation_id)->with('category')->get();
        $companyConfig = Company::find($company_id);

        $pdf = Pdf::loadView('reports.quotation', compact('quotationHead', 'quotationDtl', 'companyConfig'));
        //$pdf->set_option('debugLayout', true); // muestra bordes
        //$pdf->set_option('debugLayoutLines', true);
        //$pdf->set_option('debugLayoutBlocks', true);
        return $pdf->download("QuotationNo{$quotation_id}.pdf");
    }

    public function downloadInvoice($invoice_id){
        $company_id = Auth::user()->company_id;

        $invoiceHead = Invoice::where('id', $invoice_id)->with('customer')->first();
        $invoiceDtl = InvoiceDtl::where('invoice_id', $invoice_id)->with('category')->get();
        $companyConfig = Company::find($company_id);

        $pdf = Pdf::loadView('reports.invoice', compact('invoiceHead', 'invoiceDtl', 'companyConfig'));
        //$pdf->set_option('debugLayout', true); // muestra bordes
        //$pdf->set_option('debugLayoutLines', true);
        //$pdf->set_option('debugLayoutBlocks', true);
        return $pdf->download("InvoiceNo{$invoice_id}.pdf");
    }

}
