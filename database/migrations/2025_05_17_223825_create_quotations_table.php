<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            //$table->foreignId('customer_id')->constrained('customers');
            //agregar aqui
            $table->string('customer_name', 200);
            $table->string('customer_address', 200);
            $table->decimal('total', 10, 2);
            $table->date('mov_date')->comment('Date when the quotation was create (YYYY-MM-DD)');
            $table->enum('status', ['draft', 'invoiced'])->default('draft')->comment('Quotation status: draft or invoiced');
            $table->foreignId('company_id')->constrained('companies');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
