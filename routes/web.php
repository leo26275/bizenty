<?php
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CompanyController;
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



    /*Route::get('/quotation/create', function () {
        return Inertia::render('Quotation/Create');
    })->name('quotation.create');*/

    Route::get('/quotation', [QuotationController::class, 'index'])->name('quotation.index');
    Route::get('/quotation/create', [QuotationController::class, 'create'])->name('quotation.create');
    Route::post('/quotation/duplicate/{quotation_id}', [QuotationController::class, 'duplicate'])->name('quotation.duplicate');
    Route::post('/quotation/invoicing/{quotation_id}', [QuotationController::class, 'invoicing'])->name('quotation.invoicing');
    Route::patch('/quotation/delete/{quotation_id}', [QuotationController::class, 'delete'])->name('quotation.delete');
    Route::post('/quotation', [QuotationController::class, 'storeOrUpdate'])->name('quotation.mergue');
    Route::get('/reports/quotation/{quotation_id}/download', [ReportController::class, 'downloadQuote'])->name('reports.quotation.download');
    Route::post('/quotation/email/{quotation_id}', [ReportController::class, 'sendQuotation']);


    Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoice.create');
    Route::post('/invoice', [InvoiceController::class, 'storeOrUpdate'])->name('invoice.mergue');
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoice.index');
    Route::get('/reports/invoice/{invoice_id}/download', [ReportController::class, 'downloadInvoice'])->name('reports.invoice.download');
    Route::post('/invoice/email/{invoice_id}', [ReportController::class, 'sendInvoice']);


    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');


    /*Customers*/
    Route::get('/customers/create', function(){
        return Inertia::render('Customers/Create');
    })->name('customers.create');

    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/api/customers/all', [CustomerController::class, 'all'])->name('customers.wsindex');

    /*Company*/
    Route::get('/company/setting', [CompanyController::class, 'setting'])->name('company.setting');
    Route::post('/company/setting', [CompanyController::class, 'updateSetting'])->name('company.update');

});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
