import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  BarChart3,
  TrendingUp,
  Activity,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { AdminTable } from "@/admin/components/AdminTable";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Companion = {
  id: string;
  name: string;
  expertise: string;
  rating: number;
  status: string;
  appliedDate: string;
};

type Booking = {
  id: string;
  userName: string;
  companionName: string;
  type: string;
  platform: string;
  date: string;
  time: string;
  status: string;
};

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for dynamic data
  const [recentCompanions, setRecentCompanions] = useState<Companion[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [totalUsers, setTotalUsers] = useState("0");
  const [totalBookings, setTotalBookings] = useState("0");
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch companion applications from localStorage or backend
        const companionJSON = localStorage.getItem("nirvaha_companion_applications");
        const companions = companionJSON ? JSON.parse(companionJSON) : [];
        const recent = companions.slice(0, 3);
        setRecentCompanions(
          recent.length > 0
            ? recent
            : []
        );

        // Fetch bookings from localStorage or backend
        const bookingsJSON = localStorage.getItem("nirvaha_admin_bookings");
        const bookings = bookingsJSON ? JSON.parse(bookingsJSON) : [];
        const recentBooks = bookings.slice(0, 5);
        setRecentBookings(recentBooks);

        // Fetch or calculate stats
        const usersJSON = localStorage.getItem("nirvaha_users");
        const users = usersJSON ? JSON.parse(usersJSON) : [];
        setTotalUsers(users.length.toString());
        setTotalBookings(bookings.length.toString());
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "from-emerald-500 to-teal-500",
      change: "+0%",
      path: "/admin/users",
    },
    {
      title: "Active Sessions",
      value: recentBookings.filter((b) => b.status === "upcoming").length.toString(),
      icon: Activity,
      color: "from-teal-500 to-cyan-500",
      change: "+0%",
      path: "/admin/bookings",
    },
    {
      title: "Revenue",
      value: "$0",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-500",
      change: "+0%",
      path: "/admin/analytics",
    },
    {
      title: "Bookings",
      value: totalBookings,
      icon: BarChart3,
      color: "from-blue-500 to-indigo-500",
      change: "+0%",
      path: "/admin/bookings",
    },
  ];

  const pendingApprovals = recentCompanions.filter((c) => c.status === "pending").length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard Overview</h1>
        <p className="text-gray-700">Welcome back, {user?.name || "Admin"}</p>
      </div>

      {/* Stats Grid - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              onClick={() => navigate(stat.path)}
              className="bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-lg cursor-pointer transition-all group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-700 text-sm font-medium">{stat.title}</h3>
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-black">{stat.value}</span>
                  <span className="text-emerald-600 text-sm font-semibold">{stat.change}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Alerts / Pending Approvals */}
      {pendingApprovals > 0 && (
        <Card className="bg-yellow-50 border-yellow-300">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <h3 className="text-black font-semibold mb-1">
                  {pendingApprovals} Companion Application{pendingApprovals > 1 ? "s" : ""} Pending Approval
                </h3>
                <p className="text-gray-700 text-sm">
                  Review and approve companion applications to expand your network
                </p>
              </div>
              <Button
                onClick={() => navigate("/admin/companions?filter=pending")}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
              >
                Review Now
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companion Applications */}
        <Card className="bg-white border-emerald-200 shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">Recent Companion Applications</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/companions")}
                className="text-emerald-700 hover:text-black hover:bg-emerald-50"
              >
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <AdminTable
              data={recentCompanions}
              columns={[
                {
                  key: "name",
                  header: "Name",
                },
                {
                  key: "expertise",
                  header: "Expertise",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (item) => <StatusBadge status={item.status} variant="companion" />,
                },
                {
                  key: "appliedDate",
                  header: "Applied",
                },
              ]}
              emptyMessage="No recent companion applications"
            />
          </div>
        </Card>

        {/* Recent Bookings */}
        <Card className="bg-white border-emerald-200 shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">Recent Bookings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/bookings")}
                className="text-emerald-700 hover:text-black hover:bg-emerald-50"
              >
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <AdminTable
              data={recentBookings}
              columns={[
                {
                  key: "id",
                  header: "ID",
                },
                {
                  key: "userName",
                  header: "User",
                },
                {
                  key: "companionName",
                  header: "Companion",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (item) => <StatusBadge status={item.status} variant="booking" />,
                },
                {
                  key: "date",
                  header: "Date",
                  render: (item) => (
                    <span className="text-gray-700 text-sm">
                      {item.date} {item.time}
                    </span>
                  ),
                },
              ]}
              emptyMessage="No recent bookings"
            />
          </div>
        </Card>
      </div>

      {/* Landing Page Updates Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Landing Page Updates</h2>
              <p className="text-gray-700 text-sm">
                Easily update images and information for "What is Nirvaha" and "Explore Our Learning" sections
              </p>
            </div>
            <Button
              onClick={() => navigate("/admin/content-update")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              Manage Content
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


