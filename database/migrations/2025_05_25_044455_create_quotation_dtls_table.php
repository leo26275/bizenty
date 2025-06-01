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
        Schema::create('quotation_dtls', function (Blueprint $table) {
            $table->id();
            $table->string('description', 300);
            $table->decimal('unit_price', 10, 2);
            $table->integer('quantity');
            $table->decimal('total_amount', 10, 2);
            $table->foreignId('quotation_id')->constrained('quotations');
            $table->foreignId('category_id')->constrained('categories');
            $table->enum('record_status', ['A', 'D'])->default('A')->comment('Quotation record status: A: Active, D: Deleted');
            $table->foreignId('company_id')->constrained('companies');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_dtls');
    }
};
