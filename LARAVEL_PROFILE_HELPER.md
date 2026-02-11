# Cleaner Implementation Using Helper Method

To avoid repeating the same profile structure in multiple methods, create a helper method:

## In Your AuthController.php

```php
<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    /**
     * Format member profile data for API response
     * Use this in profile(), updateProfile(), verifyOtp(), and login() methods
     */
    private function formatProfileData($member)
    {
        return [
            'id' => $member->id,
            
            // Personal Information
            'first_name' => $member->first_name,
            'last_name' => $member->last_name,
            'email' => $member->email,
            'phone' => $member->phone,
            'date_of_birth' => $member->date_of_birth,
            'gender' => $member->gender,
            
            // Address Information
            'address_line_1' => $member->address_line_1,
            'address_line_2' => $member->address_line_2,
            'city' => $member->city,
            'state' => $member->state,
            'zip_code' => $member->zip_code,
            
            // Emergency Contact
            'emergency_contact_name' => $member->emergency_contact_name,
            'emergency_contact_phone' => $member->emergency_contact_phone,
            'emergency_contact_relation' => $member->emergency_contact_relation,
            
            // Membership Information
            'membership_type' => $member->membership_type,
            'membership_start_date' => $member->membership_start_date,
            'billing_cycle' => $member->billing_cycle,
            'preferred_location' => $member->preferred_location,
            'auto_renewal' => $member->auto_renewal,
            
            // Payment Information
            'payment_method' => $member->payment_method,
            'card_last_four' => $member->card_last_four,
            'card_expiry' => $member->card_expiry,
            
            // Additional Information
            'notes' => $member->notes,
            'referral_source' => $member->referral_source,
            'profile_photo' => $member->profile_photo 
                ? asset('storage/' . $member->profile_photo) 
                : null,
            
            // System Fields
            'status' => $member->status,
            'email_verified_at' => $member->email_verified_at,
            'created_at' => $member->created_at,
            'updated_at' => $member->updated_at,
        ];
    }

    /**
     * GET /api/profile
     * Fetch user profile
     */
    public function profile(Request $request)
    {
        $member = $request->user();

        return response()->json([
            'success' => true,
            'data' => $this->formatProfileData($member),
        ]);
    }

    /**
     * PUT /api/profile
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $member = $request->user();
        
        $validated = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|in:male,female,other,prefer-not-to-say',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relation' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'referral_source' => 'nullable|string|max:255',
        ]);
        
        $member->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $this->formatProfileData($member),
        ]);
    }

    /**
     * POST /api/auth/verify-otp
     * Verify OTP and return user + token
     */
    public function verifyOtp(Request $request)
    {
        // ... your OTP verification logic ...
        
        $member = User::find($userId); // or get the authenticated user
        $token = $member->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $this->formatProfileData($member),
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ]);
    }

    /**
     * POST /api/auth/login
     * Password login and return user + token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        
        // ... your authentication logic ...
        
        $member = User::where('email', $request->email)->first();
        // Verify password, etc.
        
        $token = $member->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $this->formatProfileData($member),
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ]);
    }
}
```

---

## Benefits

1. **DRY** - Don't repeat yourself. One source of truth for profile format
2. **Easy to maintain** - If you need to add/remove fields, change only one place
3. **Consistent** - All endpoints return the same profile structure
4. **Clean** - Methods are short and readable

---

## Routes to Add

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    
    // Or if you prefer member-specific:
    Route::get('/member/profile', [AuthController::class, 'profile']);
    Route::put('/member/profile', [AuthController::class, 'updateProfile']);
});
```

Either `/profile` or `/member/profile` works. The frontend is configured to use `/profile`, but both will work since the frontend uses the `VITE_API_BASE_URL` from environment.
