import { RequestHandler } from "express";
import { UpdateProfileRequest, SaveProfileResponse } from "@shared/types";

/**
 * GET /api/profile
 * Fetch user profile - requires authentication
 * This endpoint would typically call your Laravel backend API
 */
export const getProfile: RequestHandler = async (req, res) => {
  try {
    // Get the authorization token from the request header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Forward the request to your Laravel backend API
    const apiBaseUrl = process.env.VITE_API_BASE_URL || "http://localhost:8000";
    const response = await fetch(`${apiBaseUrl}/api/profile`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * PUT /api/profile
 * Update user profile - requires authentication
 * Only allows frontend-friendly fields
 */
export const updateProfile: RequestHandler = async (req, res) => {
  try {
    // Get the authorization token from the request header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Validate and sanitize the request body
    const profileData: UpdateProfileRequest = {};
    
    // List of allowed fields that users can edit
    const allowedFields: (keyof UpdateProfileRequest)[] = [
      "first_name",
      "last_name",
      "phone",
      "date_of_birth",
      "gender",
      "address_line_1",
      "address_line_2",
      "city",
      "state",
      "zip_code",
      "emergency_contact_name",
      "emergency_contact_phone",
      "emergency_contact_relation",
      "notes",
      "referral_source",
    ];

    // Only include allowed fields from the request body
    allowedFields.forEach((field) => {
      if (field in req.body && req.body[field] !== undefined) {
        profileData[field] = req.body[field];
      }
    });

    // Forward the update request to your Laravel backend API
    const apiBaseUrl = process.env.VITE_API_BASE_URL || "http://localhost:8000";
    const response = await fetch(`${apiBaseUrl}/api/profile`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data: SaveProfileResponse = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
