<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class InvoiceDtl extends Model
{
    protected $fillable = [
        'category_id',
        'description',
        'unit_price',
        'quantity',
        'total_amount',
        'invoice_id',
        'record_status'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quotation) {
            $quotation->company_id = Auth::user()->company_id;
        });
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
