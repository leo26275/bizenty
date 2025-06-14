<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
//use App\Models\Customer;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quotation extends Model
{
    protected $fillable = [
        'customer_id',
        'subtotal',
        'status',
        'record_status',
        'company_id',
        'mov_date',
        'expiration_date',
        'total',
        'amount_paid',
        'balance_due',
        'notes',
        'validity_term'
    ];


    protected static function boot(){
        parent::boot();

        static::creating(function ($quotation) {
            $quotation->company_id = Auth::user()->company_id;
        });

        // Si deseas proteger también en caso de actualización (opcional)
        static::updating(function ($quotation) {
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
        'mov_date' => 'date', // o 'datetime' si el campo lo requiere
        'expiration_date' => 'date'
    ];

}
