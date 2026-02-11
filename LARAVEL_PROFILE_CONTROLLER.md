# Updated Profile Controller Methods

## Replace Your Current `profile()` Method

Your current nested structure won't work with the frontend. Change it to this flat structure:

```php
public function profile(Request $request)
{
    $member = $request->user();

    return response()->json([
        'success' => true,
        'data' => [
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
        ]
    ]);
}
```

---

## Add This New `updateProfile()` Method

```php
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
    
    // Return updated profile in same format as profile() method
    return response()->json([
        'success' => true,
        'message' => 'Profile updated successfully',
        'data' => [
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
        ]
    ]);
}
```

---

## Also Update Your Auth Login/Verify Methods

Your `verifyOtp()` and `login()` methods should return the same profile structure:

```php
public function verifyOtp(Request $request)
{
    // ... your OTP verification logic ...
    
    $member = User::find($userId); // or however you get the user
    $token = $member->createToken('auth_token')->plainTextToken;
    
    return response()->json([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'user' => [
                'id' => $member->id,
                'first_name' => $member->first_name,
                'last_name' => $member->last_name,
                'email' => $member->email,
                'phone' => $member->phone,
                'date_of_birth' => $member->date_of_birth,
                'gender' => $member->gender,
                'address_line_1' => $member->address_line_1,
                'address_line_2' => $member->address_line_2,
                'city' => $member->city,
                'state' => $member->state,
                'zip_code' => $member->zip_code,
                'emergency_contact_name' => $member->emergency_contact_name,
                'emergency_contact_phone' => $member->emergency_contact_phone,
                'emergency_contact_relation' => $member->emergency_contact_relation,
                'membership_type' => $member->membership_type,
                'membership_start_date' => $member->membership_start_date,
                'billing_cycle' => $member->billing_cycle,
                'preferred_location' => $member->preferred_location,
                'auto_renewal' => $member->auto_renewal,
                'payment_method' => $member->payment_method,
                'card_last_four' => $member->card_last_four,
                'card_expiry' => $member->card_expiry,
                'notes' => $member->notes,
                'referral_source' => $member->referral_source,
                'profile_photo' => $member->profile_photo 
                    ? asset('storage/' . $member->profile_photo) 
                    : null,
                'status' => $member->status,
                'email_verified_at' => $member->email_verified_at,
                'created_at' => $member->created_at,
                'updated_at' => $member->updated_at,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ]
    ]);
}
```

Same for `login()` method - return the same structure.

---

## Summary of Changes

**Your current response:**
```json
{
  "id": 1,
  "full_name": "...",
  "membership": { /* nested object */ },
  "address": { /* nested object */ },
  "emergency_contact": { /* nested object */ }
}
```

**What frontend expects:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "...",
    "last_name": "...",
    "membership_type": "...",
    "address_line_1": "...",
    "emergency_contact_name": "...",
    /* all flat fields */
  }
}
```

**Key Changes:**
1. ✓ Wrap response in `success` boolean
2. ✓ Wrap data in `data` object
3. ✓ Flatten nested fields (no nested objects)
4. ✓ Include all required fields that frontend uses
5. ✓ Use exact field names (e.g., `address_line_1` not `address.line1`)
6. ✓ Add missing fields: `date_of_birth`, `gender`, `notes`, `referral_source`, `payment_method`, `card_last_four`, `card_expiry`
7. ✓ Remove `full_name` (frontend doesn't need it)
8. ✓ Remove `status_label` and `status_class` (not needed)
