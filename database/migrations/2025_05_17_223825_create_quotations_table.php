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
            $table->foreignId('customer_id')->constrained('customers');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);
            $table->decimal('amount_paid', 10, 2);
            $table->decimal('balance_due', 10, 2);
            $table->string('notes', 150)->nullable();
            $table->unsignedTinyInteger('validity_term');
            $table->date('mov_date')->comment('Date when the quotation was create (YYYY-MM-DD)');
            $table->enum('status', ['draft', 'invoiced'])->default('draft')->comment('Quotation status: draft, invoiced');
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
        Schema::dropIfExists('quotations');
    }
};
