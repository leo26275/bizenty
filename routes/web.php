<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');




Route::get('/categories/create', function () {
    return Inertia::render('Categories/Create');
})->middleware(['auth', 'verified'])->name('categories.create');


Route::middleware(['auth', 'verified'])->group(function(){

    Route::get('/quotation', function () {
        return Inertia::render('Quotation/Index');
    })->name('quot.index');

    Route::get('/quotation/create', function () {
        return Inertia::render('Quotation/Create');
    })->name('quot.create');



    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');


    /*Customers*/
    Route::get('/customers/create', function(){
        return Inertia::render('Customers/Create');
    })->name('customers.create');

    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
