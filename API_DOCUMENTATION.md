# API Documentation

## Overview
The frontend calls Laravel API directly via `VITE_API_BASE_URL` environment variable.  
No Express proxying - simple and clean.

---

## Authentication APIs

### Send OTP
```
POST /api/auth/send-otp
Body: { email: "user@example.com" }
Response: { success: true, message: "OTP sent" }
```

### Verify OTP
```
POST /api/auth/verify-otp
Body: { email: "user@example.com", otp: "123456" }
Response: { success: true, data: { user: {...}, token: "..." } }
```

### Password Login
```
POST /api/auth/login
Body: { email: "user@example.com", password: "..." }
Response: { success: true, data: { user: {...}, token: "..." } }
```

---

## Profile APIs

### Fetch Profile
```
GET /api/profile
Headers: Authorization: Bearer {token}
Response: { data: {...full user profile...} }
```

### Update Profile
```
PUT /api/profile
Headers: Authorization: Bearer {token}
Body: { 
  first_name: "John",
  last_name: "Doe",
  phone: "+1234567890",
  // ... only editable fields
}
Response: { data: {...updated profile...}, message: "Profile updated" }
```

---

## Frontend API Utilities

Located in `client/utils/api.ts`:

```typescript
// Public API call (no auth)
publicApiCall<T>(endpoint, options?)

// Protected API call (with Bearer token)
apiCall<T>(endpoint, options?)

// Profile shortcuts
fetchProfile<T>()
saveProfile<T>(data)
```

---

## How It Works

1. **Login** → User provides email/OTP or password → Laravel returns full profile + token
2. **Store** → Profile and token stored in localStorage and auth context
3. **Profile Page** → Loads profile from auth context (or fetches if not available)
4. **Update** → User edits fields → Frontend sends only editable fields to Laravel
5. **Sync** → Profile updates in auth context after successful save

---

## Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:8000  # Laravel backend URL
```

---

## Security

- All user-editable fields validated on Laravel backend
- Payment/membership fields cannot be updated via frontend
- Bearer token required for protected endpoints
- Auto-redirect to /login on 401 Unauthorized
