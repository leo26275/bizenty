<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Invoice;
use App\Models\InvoiceDtl;
use App\Models\Category;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class InvoiceController extends Controller
{
    public function index() : Response{
        $invoices = Invoice::with(['customer:id,first_name,middle_name,last_name'])
            ->where('record_status', 'A')
            ->get();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices
        ]);
    }

    public function create(Request $request){
        $invoice_id = $request->query('invoice_id');
        $editMode = $request->boolean('edit');
        $categories = Category::select('id', 'name')->get();
        $invoice = null;
        $invoiceDtls = null;

        if (!is_null($invoice_id) && is_numeric($invoice_id)) {
            $invoice = Invoice::find($invoice_id);
            $invoiceDtls = InvoiceDtl::where('invoice_id', $invoice_id)->with('category')->get();
            if(is_null($invoice)){
                return redirect()->route('invoice.index');
            }
            $companyConfig = Company::find($invoice->company_id);
        }else{
            $companyConfig = Company::find(Auth::user()->company_id);
        }


        return Inertia::render('Invoices/Create', [
            'categories' => $categories,
            'companyConfig' => $companyConfig,
            'invoice' => $invoice,
            'invoiceDtls' => $invoiceDtls,
            'invoice_id' => $invoice_id,
            'edit' => $editMode
        ]);
    }
}
