<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validar los datos de entrada
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Buscar al usuario por correo electrónico
        $user = User::where('email', $request->email)->first();

        // 3. Verificar si el usuario existe y la contraseña es correcta
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Las credenciales son incorrectas.'
            ], 401);
        }

        // 4. Crear un token de acceso con Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Retornar la respuesta exitosa
        return response()->json([
            'message' => '¡Bienvenido!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }
}