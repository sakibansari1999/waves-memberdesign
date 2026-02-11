# Required Laravel APIs

## You Already Have ✓
```php
Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getCurrentUser']);
    Route::get('/auth/me', [AuthController::class, 'getCurrentUser']);
    Route::get('/member/profile', [AuthController::class, 'profile']);
});
```

## You NEED to Add
```php
Route::middleware('auth:sanctum')->group(function () {
    // Update user profile
    Route::put('/member/profile', [AuthController::class, 'updateProfile']);
    
    // OR if using /api/profile endpoint
    Route::put('/profile', [AuthController::class, 'updateProfile']);
});
```

---

## API Requirements Summary

### Login Endpoints (Already Done ✓)

**Send OTP**
```
POST /auth/send-otp
Body: { email: "user@example.com" }
Response: { success: true, message: "OTP sent" }
```

**Verify OTP**
```
POST /auth/verify-otp
Body: { email: "user@example.com", otp: "123456" }
Response: 
{
  success: true,
  data: {
    user: { /* Full MemberProfile object */ },
    token: "bearer_token_string"
  }
}
```

**Password Login**
```
POST /auth/login
Body: { email: "user@example.com", password: "..." }
Response: 
{
  success: true,
  data: {
    user: { /* Full MemberProfile object */ },
    token: "bearer_token_string"
  }
}
```

---

### Profile Endpoints (You NEED to Add These)

**Get User Profile**
```
GET /member/profile
Headers: Authorization: Bearer {token}
Response: 
{
  data: {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    date_of_birth: null,
    gender: null,
    address_line_1: "123 Main St",
    address_line_2: null,
    city: "New York",
    state: "NY",
    zip_code: "10001",
    emergency_contact_name: null,
    emergency_contact_phone: null,
    emergency_contact_relation: null,
    membership_type: "platinum",
    membership_start_date: "2025-12-28T00:00:00.000000Z",
    billing_cycle: "monthly",
    preferred_location: "bay-harbor",
    auto_renewal: true,
    payment_method: "credit-card",
    card_last_four: "4242",
    card_expiry: "12/27",
    notes: null,
    referral_source: null,
    profile_photo: null,
    status: 1,
    created_at: "2025-12-28T17:45:12.000000Z",
    updated_at: "2026-02-11T06:46:16.000000Z",
    email_verified_at: null
  }
}
```

**Update User Profile** ⚠️ IMPORTANT: REQUIRED
```
PUT /member/profile
Headers: Authorization: Bearer {token}
Body: 
{
  first_name: "John",
  last_name: "Doe",
  phone: "123-456-7890",
  date_of_birth: "1990-01-01",
  gender: "male",
  address_line_1: "123 Main St",
  address_line_2: "Apt 4",
  city: "New York",
  state: "NY",
  zip_code: "10001",
  emergency_contact_name: "Jane Doe",
  emergency_contact_phone: "987-654-3210",
  emergency_contact_relation: "Spouse",
  notes: "Some notes",
  referral_source: "Google"
}
Response: 
{
  success: true,
  message: "Profile updated successfully",
  data: { /* Full updated MemberProfile */ }
}
```

**Only these fields can be updated:**
- first_name
- last_name
- phone
- date_of_birth
- gender
- address_line_1
- address_line_2
- city
- state
- zip_code
- emergency_contact_name
- emergency_contact_phone
- emergency_contact_relation
- notes
- referral_source

**DO NOT allow updates to:**
- email
- id
- membership_type
- membership_start_date
- billing_cycle
- preferred_location
- auto_renewal
- payment_method
- card_last_four
- card_expiry
- profile_photo
- status
- Any system/admin fields

---

## Summary

**Minimum Required:**
- ✓ POST /auth/send-otp (already have)
- ✓ POST /auth/verify-otp (already have)
- ✓ POST /auth/login (already have)
- ✓ GET /member/profile (already have)
- ⚠️ **PUT /member/profile (ADD THIS)**

**Optional but Recommended:**
- POST /auth/logout (for logout functionality)
- Validate OTP expires after N attempts
- Rate limit OTP sends

---

## Frontend Expects

The frontend in `client/utils/api.ts` calls:
- `publicApiCall("/api/auth/send-otp", ...)`
- `publicApiCall("/api/auth/verify-otp", ...)`
- `publicApiCall("/api/auth/login", ...)`
- `apiCall("/api/profile", ...)` ← Maps to your `/member/profile`

So your Laravel routes should match this path structure, or you can rename `/member/profile` to `/profile` in your routes.
