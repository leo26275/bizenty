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
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request) : Response{

        $invoiceId = $request->input('invoice_id');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $status = $request->input('invoice_status');


        $invoices = Invoice::with(['customer:id,first_name,middle_name,last_name'])
            ->when($invoiceId, function($query, $invoiceId){
                return $query->where('id', $invoiceId);
            })
            ->when($startDate, function($query, $startDate){
                $start = Carbon::parse($startDate)->startOfDay();
                return $query->where('mov_date', '>=', $start);
            })
            ->when($endDate, function($query, $endDate){
                $end = Carbon::parse($endDate)->endOfDay();
                return $query->where('mov_date', '<=', $end);
            })
            ->when($status, function($query, $status){
                return $query->where('status', $status['code']);
            })
            ->where('record_status', 'A')
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Invoices/Index', [
            'filters' => [
                'invoice_id' => $invoiceId
            ],
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
            $invoice = Invoice::where('id', $invoice_id)->with('customer')->first();
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
            'edit' => $editMode,
            'serverDate' => Carbon::now()
        ]);
    }

    public function storeOrUpdate(Request $request){
        $data = $request->all();
        $encabezado = $data['header'];
        $detalles = $data['details'] ?? [];
        $deletes = $data['deletes'] ?? [];

        DB::beginTransaction();

        try {
            // Buscar o crear la cotización
            $invoice_id = intval($encabezado['invoice_id']);
            $invoice = null;

            if($invoice_id == 0){

                $validity_term = intval($encabezado['validity_term']);
                $mov_date = Carbon::today();
                $expiration_date = $mov_date->addDays($validity_term);

                $invoice = Invoice::create([
                    'customer_id'   => $encabezado['customer_id'],
                    'subtotal'      => $encabezado['subtotal'],
                    'total'         => $encabezado['total'],
                    'amount_paid'   => $encabezado['amount_paid'],
                    'balance_due'   => $encabezado['balance_due'],
                    'notes'         => $encabezado['notes'],
                    'validity_term' => $validity_term,
                    'mov_date'      => $mov_date,
                    'expiration_date' => $expiration_date
                ]);
            }else{
                $invoice = Invoice::find($invoice_id);
                //throw error if not exists record
                $validity_term = intval($encabezado['validity_term']);
                $expiration_date = $invoice->mov_date->addDays($validity_term);


                $invoice->customer_id = $encabezado['customer_id'];
                $invoice->subtotal =  $encabezado['subtotal'];
                $invoice->total = $encabezado['total'];
                $invoice->amount_paid = $encabezado['amount_paid'];
                $invoice->balance_due = $encabezado['balance_due'];
                $invoice->notes = $encabezado['notes'];
                $invoice->validity_term = $validity_term;
                $invoice->expiration_date = $expiration_date;
                $invoice->save();
            }


            if(is_null($invoice)){
                throw new Exception("Ocurrio un error en el manejo del encabezado para la cotización");
            }


            // Procesar detalles (crear o actualizar)
            foreach ($detalles as $item) {
                if (str_starts_with($item['id'], 'NEW_')) {
                    // Crear nuevo detalle
                    InvoiceDtl::create([
                        'category_id'       => $item['category']['code'],
                        'description'   => $item['description'],
                        'unit_price'    => $item['unit_price'],
                        'quantity'      => $item['quantity'],
                        'total_amount'  => $item['total_amount'],
                        'invoice_id'  => $invoice->id,
                    ]);
                } else {
                    // Actualizar detalle existente
                    InvoiceDtl::where('id', $item['id'])
                        ->where('invoice_id', $invoice->id)
                        ->update([
                            'category_id'   => $item['category']['code'],
                            'description'   => $item['description'],
                            'unit_price'    => $item['unit_price'],
                            'quantity'      => $item['quantity'],
                            'total_amount'  => $item['total_amount'],
                        ]);
                }
            }

            //Log::error($deletes);

            // Eliminar detalles indicados
            if (!empty($deletes)) {
                InvoiceDtl::whereIn('id', $deletes)
                    ->where('invoice_id', $invoice->id)
                    ->delete();
            }

            DB::commit();
            return Redirect::to(route('invoice.create')."?invoice_id=$invoice->id");
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al procesar la cotización.', 'details' => $e->getMessage()], 500);
        }

    }
}
