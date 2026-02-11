<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\MemberOtpMail;

class AuthController extends Controller
{
    /**
     * Format member profile data for consistent API response
     * Use this in all endpoints that return user data
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
     * Fetch authenticated user profile
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
     * POST /api/auth/send-otp
     * Send OTP to member email
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:members,email'
        ]);

        $member = Member::where('email', $request->email)->first();

        $otp = rand(100000, 999999);

        $member->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($member->email)
            ->send(new MemberOtpMail($member, $otp));

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully to your email',
            'data' => [
                'email' => $request->email,
                'otp_expires_in' => 600,
                'masked_email' => $this->maskEmail($request->email),
            ]
        ]);
    }

    /**
     * POST /api/auth/verify-otp
     * Verify OTP and return authenticated user
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:members,email',
            'otp' => 'required|digits:6'
        ]);

        $member = Member::where('email', $request->email)->first();

        if (!$member->otp ||
            $member->otp !== $request->otp ||
            $member->otp_expires_at < now()) {

            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP',
                'errors' => [
                    'otp' => ['The OTP is invalid or has expired.']
                ]
            ], 400);
        }

        $member->update([
            'otp' => null,
            'otp_expires_at' => null,
            'email_verified_at' => now(),
        ]);

        $token = $member->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $this->formatProfileData($member),
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    /**
     * POST /api/auth/login
     * Login with email and password
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $member = Member::where('email', $request->email)->first();

        if (!$member || !Hash::check($request->password, $member->password)) {
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials are invalid.',
                'errors' => [
                    'email' => ['The provided credentials are invalid.']
                ]
            ], 401);
        }

        $token = $member->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $this->formatProfileData($member),
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    /**
     * POST /api/auth/logout
     * Logout and delete auth token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * GET /api/auth/me
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatProfileData($request->user())
        ]);
    }

    /**
     * PUT /api/profile
     * Update authenticated user profile
     * Only allows user-editable fields
     */
    public function updateProfile(Request $request)
    {
        $member = $request->user();
        
        // Only allow these fields to be updated
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
        
        // Update only validated fields
        $member->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $this->formatProfileData($member),
        ]);
    }

    /**
     * Helper function to mask email address
     */
    private function maskEmail($email)
    {
        [$name, $domain] = explode('@', $email);
        return substr($name, 0, 2)
            . str_repeat('*', strlen($name) - 2)
            . '@' . $domain;
    }
}
