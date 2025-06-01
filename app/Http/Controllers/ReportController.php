<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\User; // remove
use App\Models\Quotation;
use App\Models\QuotationDtl;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;



class ReportController extends Controller
{
    public function download($quotation_id){
        $company_id = Auth::user()->company_id;

        $quotationHead = Quotation::find($quotation_id);
        $quotationDtl = QuotationDtl::where('quotation_id', $quotation_id)->get();
        $companyConfig = Company::find($company_id);

        $users = User::all()->toArray();
        $pdf = Pdf::loadView('reports.quotation', compact('users', 'quotationHead', 'quotationDtl', 'companyConfig'));
        //$pdf->set_option('debugLayout', true); // muestra bordes
        //$pdf->set_option('debugLayoutLines', true);
        //$pdf->set_option('debugLayoutBlocks', true);

        return $pdf->download("QuotationNo{$quotation_id}.pdf");
    }
}
