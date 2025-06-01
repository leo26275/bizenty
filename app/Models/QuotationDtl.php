<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class QuotationDtl extends Model
{
    protected $fillable = [
        'category_id',
        'description',
        'unit_price',
        'quantity',
        'total_amount',
        'quotation_id'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quotationDtl) {
            $quotationDtl->company_id = Auth::user()->company_id;
        });

        static::updating(function ($quotationDtl) {
            $quotationDtl->company_id = Auth::user()->company_id;
        });
    }
}
