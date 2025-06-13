<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Customer;

class CustomerController extends Controller
{
    public function store(Request $request){
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'middle_name' => 'string|max:50',
            'last_name' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:25'
        ]);

        Customer::create($validated);

        //return redirect()->back()->with('success', '¡Categoría creada con éxito!');
        // return response()->json($category);
         return to_route('customers.index');
    }

    public function index() : Response{
        $customers = Customer::all();

        return Inertia::render('Customers/Index', [
            'customers' => $customers
        ]);
    }

    public function all(){
        $customers = Customer::all();

        return $customers;
    }
}
