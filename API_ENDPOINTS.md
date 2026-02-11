# Laravel Sanctum API Endpoints

This document outlines all the required API endpoints for the authentication flow implemented in the frontend.

## Base URL
```
http://localhost:8000/api
```

## Authentication Endpoints

### 1. Send OTP (Email)
**Endpoint:** `POST /api/auth/send-otp`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "data": {
    "email": "user@example.com",
    "otp_expires_in": 600,
    "masked_email": "us***@example.com"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Email not found",
  "errors": {
    "email": ["The email is not registered."]
  }
}
```

---

### 2. Verify OTP & Login
**Endpoint:** `POST /api/auth/verify-otp`

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "email_verified_at": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "token": "8|YourSanctumApiTokenHereXxxxxxxxxxxxxxxxxxxx",
    "token_type": "Bearer"
  }
}
```

**Error Responses:**

Invalid OTP (400):
```json
{
  "success": false,
  "message": "Invalid or expired OTP",
  "errors": {
    "otp": ["The OTP is invalid or has expired."]
  }
}
```

Too Many Attempts (429):
```json
{
  "success": false,
  "message": "Too many failed attempts. Please try again later.",
  "errors": {
    "otp": ["Please try again after some time."]
  }
}
```

---

### 3. Login with Email & Password
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "email_verified_at": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "token": "8|YourSanctumApiTokenHereXxxxxxxxxxxxxxxxxxxx",
    "token_type": "Bearer"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "The provided credentials are invalid.",
  "errors": {
    "email": ["The provided credentials are invalid."]
  }
}
```

---

### 4. Logout
**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

### 5. Get Current User (Protected)
**Endpoint:** `GET /api/user` (or `/api/auth/me`)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "email_verified_at": "2024-01-15T10:30:00Z",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

## Laravel Controller Implementation Example

### AuthController.php

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Send OTP
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        // Generate and store OTP
        $otp = rand(100000, 999999);
        $user = User::where('email', $request->email)->first();
        $user->update(['otp' => $otp, 'otp_expires_at' => now()->addMinutes(10)]);

        // Send email with OTP
        // Mail::send('emails.otp', ['otp' => $otp], function($m) use ($request) {
        //     $m->to($request->email)->subject('Your OTP');
        // });

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully',
            'data' => [
                'email' => $request->email,
                'otp_expires_in' => 600,
                'masked_email' => $this->maskEmail($request->email),
            ]
        ]);
    }

    // Verify OTP and Login
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric|digits:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user->otp || $user->otp != $request->otp || $user->otp_expires_at < now()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP',
                'errors' => ['otp' => ['The OTP is invalid or has expired.']]
            ], 400);
        }

        // Clear OTP
        $user->update(['otp' => null, 'otp_expires_at' => null]);

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user->toArray(),
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    // Login with Email & Password
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials are invalid.',
                'errors' => ['email' => ['The provided credentials are invalid.']]
            ], 401);
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user->toArray(),
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    // Get Current User
    public function getCurrentUser(Request $request)
    {
        return response()->json([
            'data' => $request->user()
        ]);
    }

    private function maskEmail($email)
    {
        [$name, $domain] = explode('@', $email);
        return substr($name, 0, 2) . str_repeat('*', strlen($name) - 2) . '@' . $domain;
    }
}
```

### routes/api.php

```php
<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getCurrentUser']);
    Route::get('/auth/me', [AuthController::class, 'getCurrentUser']);
});
```

---

## Environment Variables

Add these to your `.env` file:

```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
SANCTUM_GUARD=sanctum
```

---

## CORS Configuration

In `config/cors.php`, ensure:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['localhost:3000', 'localhost:5173'],
'allow_credentials' => true,
```

---

## Testing the Endpoints

### Using cURL:

**Send OTP:**
```bash
curl -X POST http://localhost:8000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Verify OTP:**
```bash
curl -X POST http://localhost:8000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Logout (with token):**
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Get Current User:**
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```
