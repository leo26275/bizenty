<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Company;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    public function setting(Request $request)
    {
        $company = Company::find(Auth::user()->company_id);

        return Inertia::render('Company/Setting', [
            'settingData' => $company,
            'logoURL' => asset('storage/uploads/' . $company->logo)
        ]);
    }

    public function updateSetting(Request $request)
    {

        $request->validate([
            'company_name' => 'required|string',
            'legal_name' => 'required|string',
            'address' => 'required|string',
            'website' => 'required|string',
            'phone' => 'required|string',
        ]);


        /*Logo image*/
        $base64Image = $request->input('logo_base64');
        if(!is_null($base64Image)){
            if (!preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches)) {
                return back()->withErrors(['logo_base64' => 'Formato de imagen no válido.']);
            }

            $extension = strtolower($matches[1]); // jpg, png, etc.
            $imageData = substr($base64Image, strpos($base64Image, ',') + 1);
            $imageData = base64_decode($imageData);

            if ($imageData === false) {
                return back()->withErrors(['logo_base64' => 'No se pudo decodificar la imagen.']);
            }


            $filename = "logo_company.jpg";
            $path = 'uploads/' . $filename;
            Storage::disk('public')->put($path, $imageData);
        }

        $company = Company::find(Auth::user()->company_id);

        $company->company_name = $request->input('company_name');
        $company->legal_name = $request->input('legal_name');
        $company->address = $request->input('address');
        $company->website = $request->input('website');
        $company->phone = $request->input('phone');
        $company->save();

        return redirect()->back()->with('success', 'Empresa guardada con éxito');
    }
}
