<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncomesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incomes', function (Blueprint $table) {
        	$table->id();
        	$table->foreignId('user_id')->constrained()->onDelete('cascade');
        	$table->string('source'); // Ej: Sueldo, Ingreso extra
        	$table->decimal('amount', 10, 2);
        	$table->text('description')->nullable();
        	$table->date('date');
        	$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('incomes');
    }
}
