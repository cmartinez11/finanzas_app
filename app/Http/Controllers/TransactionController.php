<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = $request->user()->transactions()->latest()->get();
        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'type' => 'required|in:income,expense',
            'category' => 'nullable|string|max:255',
        ]);

        $transaction = $request->user()->transactions()->create([
            'title' => $request->title,
            'amount' => $request->amount,
            'type' => $request->type,
            'category' => $request->category ?? 'General',
        ]);

        return response()->json([
            'message' => 'Transacción registrada con éxito',
            'transaction' => $transaction
        ], 201);
    }
}