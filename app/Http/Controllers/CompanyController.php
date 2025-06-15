<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Company;

class CompanyController extends Controller
{
    public function setting(Request $request){
        $company = Company::find(Auth::user()->company_id);
    }

    public function updateSetting(Request $request){

    }
}
