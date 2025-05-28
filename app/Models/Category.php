<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Category extends Model
{
    protected $fillable = [
        'name', // Otros campos permitidos
        // 'company_id' NO debe estar en fillable para evitar que sea seteado desde request
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            $category->company_id = Auth::user()->company_id;
        });

        // Si deseas proteger también en caso de actualización (opcional)
        static::updating(function ($category) {
            // Solo lo reasignas si quieres evitar cambios posteriores
            $category->company_id = Auth::user()->company_id;
        });
    }
}
