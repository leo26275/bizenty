<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\User;

class ReportController extends Controller
{
    public function download(){
        $quotation_id = 1;

        $users = User::all()->toArray();
        $pdf = Pdf::loadView('reports.quotation', compact('users'));
        return $pdf->download('Cotizacion_Num0012474.pdf');
    }
}
