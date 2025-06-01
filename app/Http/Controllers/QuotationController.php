<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quotation;
use App\Models\QuotationDtl;
use App\Models\Category;
use App\Models\Company;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class QuotationController extends Controller
{

    public function index() : Response{
        $quotations = Quotation::all();

        return Inertia::render('Quotation/Index', [
            'quotations' => $quotations
        ]);
    }

    public function create(Request $request){
        $quotation_id = $request->query('quotation_id');
        $categories = Category::select('id', 'name')->get();
        $quotation = null;
        $quotationDtls = null;

        if (!is_null($quotation_id) && is_numeric($quotation_id)) {
            $quotation = Quotation::find($quotation_id);
            $quotationDtls = QuotationDtl::where('quotation_id', $quotation_id)->get();
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
            'edit' => $request->boolean('edit')
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
            $quotation_id = $encabezado['quotation_id'];
            $cotizacion = null;

            if($quotation_id == '0'){
                $cotizacion = Quotation::create([
                    'customer_name'    => $encabezado['customer_name'],
                    'customer_address' => $encabezado['customer_address'],
                    'company_name'     => $encabezado['company_name'],
                    'company_address'  => $encabezado['company_address'],
                    'total'            => $encabezado['total'],
                    'mov_date'         => now()->toDateString()
                ]);
            }else{
                $cotizacion = Quotation::where('id', $quotation_id)
                 ->update([
                    'customer_name'    => $encabezado['customer_name'],
                    'customer_address' => $encabezado['customer_address'],
                    'company_name'     => $encabezado['company_name'],
                    'company_address'  => $encabezado['company_address'],
                    'total'            => $encabezado['total']
                 ]);

            }

            $tracking .= 'Cotizacion id ' . $cotizacion->id;

            if(is_null($cotizacion)){
                throw new Exception("Ocurrio un error en el manejo del encabezado para la cotización");
            }

            //$cotizacion = Quotation::updateOrCreate

            // Procesar detalles (crear o actualizar)
            foreach ($detalles as $item) {
                if (str_starts_with($item['id'], 'NEW_')) {
                    // Crear nuevo detalle
                    QuotationDtl::create([
                        'category_id'       => $item['type']['id'],
                        'type_name'     => $item['type']['name'],
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
                            'category_id'       => $item['type']['id'],
                            'description'   => $item['description'],
                            'unit_price'    => $item['unit_price'],
                            'quantity'      => $item['quantity'],
                            'total_amount'  => $item['total_amount'],
                        ]);
                }
            }

            // Eliminar detalles indicados
            if (!empty($deletes)) {
                QuotationDtl::whereIn('id', $deletes)
                    ->where('quotation_id', $cotizacion->quotation_id)
                    ->delete();
            }

            DB::commit();
            return response()->json(['message' => 'Cotización procesada correctamente.'], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al procesar la cotización.' . $tracking, 'details' => $e->getMessage()], 500);
        }

    }
}
