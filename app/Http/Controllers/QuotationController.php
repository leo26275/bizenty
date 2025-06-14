<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quotation;
use App\Models\QuotationDtl;
use App\Models\Invoice;
use App\Models\InvoiceDtl;
use App\Models\Category;
use App\Models\Company;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class QuotationController extends Controller
{

    public function index() : Response{
        $quotations = Quotation::with(['customer:id,first_name,middle_name,last_name'])
            ->where('record_status', 'A')
            ->get();

        return Inertia::render('Quotation/Index', [
            'quotations' => $quotations
        ]);
    }

    public function create(Request $request){
        $quotation_id = $request->query('quotation_id');
        $editMode = $request->boolean('edit');
        $categories = Category::select('id', 'name')->get();
        $quotation = null;
        $quotationDtls = null;

        if (!is_null($quotation_id) && is_numeric($quotation_id)) {
            $quotation = Quotation::where('id', $quotation_id)->with('customer')->first();
            $quotationDtls = QuotationDtl::where('quotation_id', $quotation_id)->with('category')->get();
            if(is_null($quotation)){
                return redirect()->route('quotation.index');
            }
            $companyConfig = Company::find($quotation->company_id);
        }else{
            $companyConfig = Company::find(Auth::user()->company_id);
        }


        return Inertia::render('Quotation/Create', [
            'categories' => $categories,
            'companyConfig' => $companyConfig,
            'quotation' => $quotation,
            'quotationDtls' => $quotationDtls,
            'quotation_id' => $quotation_id,
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

        $tracking = "";
        try {
            // Buscar o crear la cotización
            $quotation_id = intval($encabezado['quotation_id']);
            $cotizacion = null;

            if($quotation_id == 0){

                $validity_term = intval($encabezado['validity_term']);
                $mov_date = Carbon::today();
                $expiration_date = $mov_date->addDays($validity_term);

                $cotizacion = Quotation::create([
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
                $cotizacion = Quotation::find($quotation_id);
                //throw error if not exists record
                $validity_term = intval($encabezado['validity_term']);
                $expiration_date = $cotizacion->mov_date->addDays($validity_term);


                $cotizacion->customer_id = $encabezado['customer_id'];
                $cotizacion->subtotal =  $encabezado['subtotal'];
                $cotizacion->total = $encabezado['total'];
                $cotizacion->amount_paid = $encabezado['amount_paid'];
                $cotizacion->balance_due = $encabezado['balance_due'];
                $cotizacion->notes = $encabezado['notes'];
                $cotizacion->validity_term = $validity_term;
                $cotizacion->expiration_date = $expiration_date;
                $cotizacion->save();
            }

            $tracking .= 'Cotizacion id ' . $cotizacion->id;

            if(is_null($cotizacion)){
                throw new Exception("Ocurrio un error en el manejo del encabezado para la cotización");
            }


            // Procesar detalles (crear o actualizar)
            foreach ($detalles as $item) {
                if (str_starts_with($item['id'], 'NEW_')) {
                    // Crear nuevo detalle
                    QuotationDtl::create([
                        'category_id'       => $item['category']['code'],
                        'description'   => $item['description'],
                        'unit_price'    => $item['unit_price'],
                        'quantity'      => $item['quantity'],
                        'total_amount'  => $item['total_amount'],
                        'quotation_id'  => $cotizacion->id,
                    ]);
                } else {
                    // Actualizar detalle existente
                    QuotationDtl::where('id', $item['id'])
                        ->where('quotation_id', $cotizacion->id)
                        ->update([
                            'category_id'   => $item['category']['code'],
                            'description'   => $item['description'],
                            'unit_price'    => $item['unit_price'],
                            'quantity'      => $item['quantity'],
                            'total_amount'  => $item['total_amount'],
                        ]);
                }
            }

            Log::error($deletes);

            // Eliminar detalles indicados
            if (!empty($deletes)) {
                QuotationDtl::whereIn('id', $deletes)
                    ->where('quotation_id', $cotizacion->id)
                    ->delete();
            }

            DB::commit();
            return Redirect::to(route('quotation.create')."?quotation_id=$cotizacion->id");
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al procesar la cotización.' . $tracking, 'details' => $e->getMessage()], 500);
        }

    }


    public function duplicate(Request $request){
        $quotation_id = $request->quotation_id;

        try{

            $quotationOrigin = Quotation::find($quotation_id);
            if(is_null($quotationOrigin)){
                return response()->json(['message' => 'The source record was not found'], 404);
            }

            DB::beginTransaction();
            $quotationCopy = $quotationOrigin->replicate();

            //Modify specific fields
            $quotationCopy->status = 'draft';
            $quotationCopy->created_at = now();
            $quotationCopy->updated_at = now();
            $quotationCopy->save();

            //Duplicate details
            foreach($quotationOrigin->details as $detail){
                $detailCopy = $detail->replicate();
                $detailCopy->quotation_id = $quotationCopy->id;
                $detailCopy->save();
            }


            DB::commit();

            //return response()->json(['message' => 'Duplicado correctamente.']);
            return Redirect::to(route('quotation.create')."?quotation_id=$quotationCopy->id");

        }catch(\Exception $ex){
            DB::rollBack();
            Log::error('Error al duplicar factura: ' . $e->getMessage());
            return response()->json(['message' => 'Error al duplicar la factura.'], 500);
        }

    }

    public function invoicing(Request $request){


         $quotation_id = $request->quotation_id;

         $quotation = Quotation::find($quotation_id);
         if(is_null($quotation)){
            return response()->json(['message' => 'The source record was not found'], 404);
         }

         try{
            DB::beginTransaction();
            Log::info('ingreso en el metodo 01');
            $invoice = Invoice::create([
                'customer_id' => $quotation->customer_id,
                'subtotal' => $quotation->subtotal,
                'total' => $quotation->total,
                'amount_paid' => $quotation->amount_paid,
                'balance_due' => $quotation->balance_due,
                'notes' => $quotation->notes,
                'mov_date' => now()->toDateString(),
                'status' => 'draft',
                'quotation_id' => $quotation->id
            ]);


            foreach($quotation->details as $QuotDetail){
                $invoiceDetail = InvoiceDtl::create([
                    'category_id' => $QuotDetail->category_id,
                    'description' => $QuotDetail->description,
                    'unit_price' => $QuotDetail->unit_price,
                    'quantity' => $QuotDetail->quantity,
                    'total_amount' => $QuotDetail->total_amount,
                    'invoice_id' => $invoice->id
                ]);
            }

            //Change Quotation Status
            $quotation->status = 'invoiced';
            $quotation->save();

            Log::info('ingreso en el metodo 03, Llego al final');
            DB::commit();
            return Redirect::to(route('invoice.create')."?invoice_id=$invoice->id");
         }catch(\Exception $ex){
            DB::rollBack();
            Log::error('Error al ejecutar facturacion de cotizacion: ' . $ex->getMessage());
            return response()->json(['message' => 'Error has occurred during quot invoicing'], 500);
         }

    }

    public function delete(Request $request){
        $quotation_id = $request->quotation_id;
        $quotation = Quotation::find($quotation_id);

        if(is_null($quotation)){
            return response()->json(['message' => 'The source record was not found'], 404);
        }

        try{
            $quotation->record_status = 'D';
            $quotation->save();
            return Redirect::to(route('quotation.index'));
        }catch(\Exception $ex){
            return response()->json(['message' => 'Error has occurred during delete record']);
        }

    }
}
