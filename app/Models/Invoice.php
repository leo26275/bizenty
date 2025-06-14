<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Invoice extends Model
{
    protected $fillable = [
        'customer_id',
        'subtotal',
        'total',
        'amount_paid',
        'balance_due',
        'notes',
        'mov_date',
        'expiration_date',
        'status',
        'record_status',
        'quotation_id',

    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quotation) {
            $quotation->company_id = Auth::user()->company_id;
        });
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function details() : HasMany {
        return $this->hasMany(QuotationDtl::class);
    }

    /*this configuracion return a Carbon Object on the model */
    protected $casts = [
        'mov_date' => 'date',
        'expiration_date' => 'date'
    ];
}
