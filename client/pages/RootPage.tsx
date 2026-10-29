import { useAuth } from "@/context/AuthContext";
import Login from "./Login";
import Search from "./Search";

/**
 * Root Page - Conditionally displays Welcome or Search based on auth status
 * - Not logged in: Shows Welcome page with signup/login options
 * - Logged in: Shows Search page with boat browsing
 */
export default function RootPage() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Welcome for non-authenticated users
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show Search for authenticated users
  return <Search />;
}
