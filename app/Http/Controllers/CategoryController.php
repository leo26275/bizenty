<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:100'
        ]);

        Category::create($validated);

        //return redirect()->back()->with('success', '¡Categoría creada con éxito!');
        // return response()->json($category);
         return to_route('categories.index');
    }

    public function index() : Response{
        $categories = Category::all();

        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }
}
