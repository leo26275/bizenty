<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Quotation extends Model
{
    protected $fillable = [
        'customer_name',
        'customer_address',
        'mov_date',
        'total'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quotation) {
            $quotation->company_id = Auth::user()->company_id;
        });

        // Si deseas proteger también en caso de actualización (opcional)
        static::updating(function ($quotation) {
            $quotation->company_id = Auth::user()->company_id;
        });
    }
}
