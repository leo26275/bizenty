<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Customer extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'address',
        'phone'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            $customer->company_id = Auth::user()->company_id;
        });

        // Si deseas proteger también en caso de actualización (opcional)
        static::updating(function ($customer) {
            $customer->company_id = Auth::user()->company_id;
        });
    }
}
