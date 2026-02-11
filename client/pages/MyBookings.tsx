import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMyBookings } from "@/hooks/useMyBookings";
import { MyBooking } from "@/utils/api";

type BookingStatus = "upcoming" | "past" | "cancelled";

export default function MyBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<BookingStatus>("upcoming");

  // Fetch bookings for active tab
  const { data: bookingsResponse, isLoading, error } = useMyBookings(activeTab);
  const bookings: MyBooking[] = bookingsResponse?.data || [];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; border: string; label: string }> = {
      confirmed: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", label: "Confirmed" },
      pending: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", label: "Pending" },
      completed: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", label: "Completed" },
      cancelled: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300", label: "Cancelled" },
    };

    const config = statusMap[status] || statusMap.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const BookingCard = ({ booking }: { booking: MyBooking }) => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
      <img
        src={booking.fleet.image || "https://via.placeholder.com/96"}
        alt={booking.fleet.boat_name}
        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-semibold text-base mb-1">
              {booking.fleet.boat_name}
            </h3>
            <p className="text-gray-500 text-sm">
              {booking.fleet.type} · {booking.fleet.dock_location}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(booking.start_date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{booking.start_time} - {booking.end_time}</span>
          </div>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-lg">My Bookings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingStatus)} className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="upcoming"
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-blue-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 data-[state=active]:text-gray-900 text-gray-500 font-medium"
            >
              Upcoming
              <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                {isLoading ? "-" : bookings.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-blue-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 data-[state=active]:text-gray-900 text-gray-500 font-medium"
            >
              Past
              <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                {isLoading ? "-" : bookings.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-blue-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 data-[state=active]:text-gray-900 text-gray-500 font-medium"
            >
              Cancelled
              <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                {isLoading ? "-" : bookings.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary"></div>
                <p className="mt-2 text-gray-600">Loading bookings...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 mb-6">
              <p className="font-medium">Error loading bookings</p>
              <p className="text-sm">{error instanceof Error ? error.message : "Something went wrong"}</p>
            </div>
          )}

          {/* Content - Upcoming Tab */}
          {!isLoading && activeTab === "upcoming" && (
            <TabsContent value="upcoming" className="mt-0">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-base">No upcoming bookings</p>
                </div>
              )}
            </TabsContent>
          )}

          {/* Content - Past Tab */}
          {!isLoading && activeTab === "past" && (
            <TabsContent value="past" className="mt-0">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-base">No past bookings</p>
                </div>
              )}
            </TabsContent>
          )}

          {/* Content - Cancelled Tab */}
          {!isLoading && activeTab === "cancelled" && (
            <TabsContent value="cancelled" className="mt-0">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-base">No cancelled bookings</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
