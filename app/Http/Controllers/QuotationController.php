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

    public function create(){
        $categories = Category::select('id', 'name')->get();
        $companyConfig = Company::find(Auth::user()->company_id);

        return Inertia::render('Quotation/Create', [
            'categories' => $categories,
            'companyConfig' => $companyConfig
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
            $quotation_id = $encabezado['quotation_id'];

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
                        'quotation_id'  => $cotizacion->quotation_id,
                    ]);
                } else {
                    // Actualizar detalle existente
                    QuotationDtl::where('id', $item['id'])
                        ->where('quotation_id', $cotizacion->quotation_id)
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
            return response()->json(['error' => 'Error al procesar la cotización.', 'details' => $e->getMessage()], 500);
        }

    }
}
