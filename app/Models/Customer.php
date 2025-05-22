<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'address',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            //$category->company_id = Session::get('company_loged');
            $category->company_id = 1;
        });

        // Si deseas proteger también en caso de actualización (opcional)
        static::updating(function ($category) {
            // Solo lo reasignas si quieres evitar cambios posteriores
            // $category->company_id = Session::get('company_loged');
            $category->company_id = 1;
        });
    }
}
