import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import BACKEND_CONFIG from "@/config/backend";
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
  companionName?: string;
  itemName?: string;
  type: string;
  platform: string;
  date: string;
  time: string;
  status: string;
  price?: number;
};

type Registration = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  // State for dynamic data
  const [recentCompanions, setRecentCompanions] = useState<Companion[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([]);
  const [totalUsers, setTotalUsers] = useState("0");
  const [totalBookings, setTotalBookings] = useState("0");
  const [activeSessions, setActiveSessions] = useState("0");
  const [revenue, setRevenue] = useState("$0");
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = BACKEND_CONFIG.API_BASE_URL;

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsResponse, bookingsResponse, usersResponse, companionsResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/api/admin/stats`),
          fetch(`${apiBaseUrl}/api/bookings`),
          fetch(`${apiBaseUrl}/api/users?limit=5`),
          fetch(`${apiBaseUrl}/api/companion-applications?status=all`),
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setTotalUsers(statsData.totalUsers.toString());
          setTotalBookings(statsData.totalBookings.toString());
          setRevenue(`$${statsData.revenue}`);
        }

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const normalizedBookings = Array.isArray(bookingsData)
            ? bookingsData.map((booking: any) => {
                let parsedDate = String(booking.date || booking.createdAt || "");
                let parsedTime = String(booking.time || "");
                const platformLower = String(booking.platform || "").toLowerCase();
                if (platformLower.includes("ist") || platformLower.includes("am") || platformLower.includes("pm") || platformLower.includes("tomorrow") || platformLower.includes("today")) {
                  parsedTime = booking.platform;
                }
                if (parsedDate.includes("T") && parsedDate.endsWith("Z")) {
                  const d = new Date(parsedDate);
                  if (!isNaN(d.getTime())) {
                    parsedDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                    if (!parsedTime || parsedTime.includes("Online")) {
                      parsedTime = d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
                    }
                  }
                }
                return {
                  ...booking,
                  id: booking.id || booking._id || booking._doc?.id || booking._doc?._id,
                  date: parsedDate,
                  time: parsedTime,
                };
              })
            : [];
          setRecentBookings(normalizedBookings.slice(0, 5));
          
          const inProgressCount = normalizedBookings.filter(
            (b: any) => b.status === "in-progress" || b.status === "In Progress" || b.status === "in progress"
          ).length;
          setActiveSessions(inProgressCount.toString());
        }

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          const normalizedUsers = Array.isArray(usersData)
            ? usersData.map((user: any) => ({
                ...user,
                id: user.id || user._id || user._doc?.id || user._doc?._id,
              }))
            : [];
          setRecentRegistrations(normalizedUsers);
        }

        if (companionsResponse.ok) {
          const companionsData = await companionsResponse.json();
          const normalizedCompanions = Array.isArray(companionsData)
            ? companionsData.map((companion: any) => ({
                id: companion.id,
                name: companion.name || companion.fullName || "Unknown",
                expertise: companion.expertise || companion.title || "N/A",
                status: companion.status || "pending",
                appliedDate: companion.appliedDate || companion.submittedAt || companion.createdAt || "",
              }))
            : [];
          setRecentCompanions(normalizedCompanions.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);

        const bookingsJSON = localStorage.getItem("nirvaha_admin_bookings");
        const bookings = bookingsJSON ? JSON.parse(bookingsJSON) : [];
        setRecentBookings(bookings.slice(0, 5));

        const usersJSON = localStorage.getItem("nirvaha_users");
        const users = usersJSON ? JSON.parse(usersJSON) : [];
        setTotalUsers(users.length.toString());
        setTotalBookings(bookings.length.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!socket) return;

    const refresh = () => {
      // Small delay to allow DB update
      setTimeout(() => {
        const event = new Event("refreshAdminDashboard");
        window.dispatchEvent(event);
      }, 500);
    };

    socket.on("new-companion-request", refresh);
    socket.on("booking-created", refresh);
    socket.on("user-registered", refresh);

    return () => {
      socket.off("new-companion-request", refresh);
      socket.off("booking-created", refresh);
      socket.off("user-registered", refresh);
    };
  }, [socket]);

  useEffect(() => {
    const handleRefresh = () => {
      // Re-fetch logic triggered by socket events
      const fetchData = async () => {
        try {
          const [statsResponse, bookingsResponse, usersResponse, companionsResponse] = await Promise.all([
            fetch(`${apiBaseUrl}/api/admin/stats`),
            fetch(`${apiBaseUrl}/api/bookings`),
            fetch(`${apiBaseUrl}/api/users?limit=5`),
            fetch(`${apiBaseUrl}/api/companion-applications?status=all`),
          ]);

          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setTotalUsers(statsData.totalUsers.toString());
            setTotalBookings(statsData.totalBookings.toString());
            setRevenue(`$${statsData.revenue}`);
          }

          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            const normalizedBookings = Array.isArray(bookingsData)
              ? bookingsData.map((booking: any) => {
                  let parsedDate = String(booking.date || booking.createdAt || "");
                  let parsedTime = String(booking.time || "");
                  const platformLower = String(booking.platform || "").toLowerCase();
                  if (platformLower.includes("ist") || platformLower.includes("am") || platformLower.includes("pm") || platformLower.includes("tomorrow") || platformLower.includes("today")) {
                    parsedTime = booking.platform;
                  }
                  if (parsedDate.includes("T") && parsedDate.endsWith("Z")) {
                    const d = new Date(parsedDate);
                    if (!isNaN(d.getTime())) {
                      parsedDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                      if (!parsedTime || parsedTime.includes("Online")) {
                        parsedTime = d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
                      }
                    }
                  }
                  return {
                    ...booking,
                    id: booking.id || booking._id || booking._doc?.id || booking._doc?._id,
                    date: parsedDate,
                    time: parsedTime,
                  };
                })
              : [];
            setRecentBookings(normalizedBookings.slice(0, 5));
            
            const inProgressCount = normalizedBookings.filter(
              (b: any) => b.status === "in-progress" || b.status === "In Progress" || b.status === "in progress"
            ).length;
            setActiveSessions(inProgressCount.toString());
          }

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const normalizedUsers = Array.isArray(usersData)
              ? usersData.map((user: any) => ({
                  ...user,
                  id: user.id || user._id || user._doc?.id || user._doc?._id,
                }))
              : [];
            setRecentRegistrations(normalizedUsers);
          }

          if (companionsResponse.ok) {
            const companionsData = await companionsResponse.json();
            const normalizedCompanions = Array.isArray(companionsData)
              ? companionsData.map((companion: any) => ({
                  id: companion.id,
                  name: companion.name || companion.fullName || "Unknown",
                  expertise: companion.expertise || companion.title || "N/A",
                  status: companion.status || "pending",
                  appliedDate: companion.appliedDate || companion.submittedAt || companion.createdAt || "",
                }))
              : [];
            setRecentCompanions(normalizedCompanions.slice(0, 3));
          }
        } catch (error) {
          console.error("Failed to refresh admin dashboard data:", error);
        }
      };

      fetchData();
    };

    window.addEventListener("refreshAdminDashboard", handleRefresh);
    return () => window.removeEventListener("refreshAdminDashboard", handleRefresh);
  }, [apiBaseUrl]);

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
      value: activeSessions,
      icon: Activity,
      color: "from-teal-500 to-cyan-500",
      change: "+0%",
      path: "/admin/bookings",
    },
    {
      title: "Revenue",
      value: revenue,
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
    <div className="p-6 bg-[#F4FAF6] min-h-screen -m-6 rounded-tl-3xl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-[#D5EEDD] rounded-2xl p-6 shadow-sm mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1F4131] mb-1">Dashboard Overview</h1>
            <p className="text-[#64C08E] font-medium">Welcome back, {user?.name || "Admin"}</p>
          </div>
        </div>

        {/* Stats Grid - Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            // Map the colors to softer greens/teals to match the theme instead of the old colors
            let colorClass = "from-[#B9EBD1] to-[#D5F2D9] text-[#1A4F35]";
            if (stat.title === "Total Users") colorClass = "from-[#B9EBD1] to-[#D5F2D9] text-[#1A4F35]";
            else if (stat.title === "Active Sessions") colorClass = "from-[#D5F2D9] to-[#E6F5EB] text-[#295641]";
            else if (stat.title === "Revenue") colorClass = "from-[#A7E2C3] to-[#BEE4CD] text-[#1F4131]";
            else colorClass = "from-[#86CDA6] to-[#A7E2C3] text-[#1F4131]";

            return (
              <Card
                key={index}
                onClick={() => navigate(stat.path)}
                className="bg-white border-[#D5EEDD] hover:border-[#5ABF88] hover:shadow-md cursor-pointer transition-all group rounded-2xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#2A4939] text-sm font-bold">{stat.title}</h3>
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}
                    >
                      <Icon className="w-5 h-5 opacity-90" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-[#1F4131]">{stat.value}</span>
                    <span className="text-[#40B075] text-sm font-bold bg-[#EAFBF0] px-2 py-1 rounded-md">{stat.change}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Alerts / Pending Approvals */}
        {pendingApprovals > 0 && (
          <Card className="bg-[#FFFDF0] border-[#FCE181] rounded-2xl shadow-sm">
            <div className="p-6 flex items-center gap-4">
              <div className="bg-[#FFF5CC] p-3 rounded-xl text-[#B38D19]">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#66500F] font-bold text-lg mb-1">
                  {pendingApprovals} Companion Application{pendingApprovals > 1 ? "s" : ""} Pending Approval
                </h3>
                <p className="text-[#997917] text-sm font-medium">
                  Review and approve companion applications to expand your network
                </p>
              </div>
              <Button
                onClick={() => navigate("/admin/companions?filter=pending")}
                className="bg-[#D9AC26] hover:bg-[#B38D19] text-white rounded-xl px-6 font-bold shadow-sm border-none"
              >
                Review Now
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Companion Applications */}
          <Card className="bg-white border-[#D5EEDD] rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#EAFBF0] flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-[#1F4131]">Recent Companions</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/companions")}
                className="text-[#34A46B] hover:text-[#1F4131] hover:bg-[#EAFBF0] font-bold rounded-lg"
              >
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-x-auto flex-1">
               <div className="grid grid-cols-12 gap-2 bg-gradient-to-r from-[#B9EBD1] to-[#D5F2D9] p-3 text-[10px] font-bold text-[#1A4F35] tracking-widest uppercase">
                  <div className="col-span-4 pl-2">Name</div>
                  <div className="col-span-3">Expertise</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-2">Applied</div>
               </div>
               <div className="divide-y divide-[#E6F5EB]">
                  {recentCompanions.map((item) => (
                     <div key={item.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-[#F6FDF8] transition-colors">
                        <div className="col-span-4 pl-2 font-medium text-[#2A4939] text-sm truncate pr-2" title={item.name}>{item.name}</div>
                        <div className="col-span-3 text-xs text-[#64C08E] font-medium truncate pr-2">{item.expertise}</div>
                        <div className="col-span-3">
                           <StatusBadge status={item.status} variant="companion" />
                        </div>
                        <div className="col-span-2 text-xs text-gray-500 font-semibold">{item.appliedDate}</div>
                     </div>
                  ))}
                  {recentCompanions.length === 0 && (
                     <div className="p-8 text-center text-[#64C08E] font-bold text-sm">No recent applications</div>
                  )}
               </div>
            </div>
          </Card>

           {/* Recent Bookings */}
          <Card className="bg-white border-[#D5EEDD] rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#EAFBF0] flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-[#1F4131]">Recent Bookings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/bookings")}
                className="text-[#34A46B] hover:text-[#1F4131] hover:bg-[#EAFBF0] font-bold rounded-lg"
              >
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-x-auto flex-1">
               <div className="grid grid-cols-12 gap-2 bg-gradient-to-r from-[#B9EBD1] to-[#D5F2D9] p-3 text-[10px] font-bold text-[#1A4F35] tracking-widest uppercase">
                  <div className="col-span-1 pl-2">ID</div>
                  <div className="col-span-2">User</div>
                  <div className="col-span-3">Target</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-3">Date</div>
               </div>
               <div className="divide-y divide-[#E6F5EB]">
                  {recentBookings.map((item) => (
                     <div key={item.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-[#F6FDF8] transition-colors">
                        <div className="col-span-1 pl-2">
                           <span className="font-mono text-[10px] font-medium text-[#295641] bg-[#EAFBF0] px-1.5 py-0.5 rounded border border-[#BDE8CE] truncate block w-fit" title={item.id}>{item.id.substring(0, 6)}</span>
                        </div>
                        <div className="col-span-2 font-medium text-[#2A4939] text-sm truncate pr-2" title={item.userName}>{item.userName}</div>
                        <div className="col-span-3 text-xs text-[#64C08E] font-medium truncate pr-2">{item.companionName || item.itemName || item.type}</div>
                        <div className="col-span-3">
                           <StatusBadge status={item.status} variant="booking" />
                        </div>
                        <div className="col-span-3">
                           <div className="font-medium text-[#2A4939] text-xs truncate">{item.date}</div>
                           <div className="text-[10px] text-gray-500 font-semibold truncate">{item.time}</div>
                        </div>
                     </div>
                  ))}
                  {recentBookings.length === 0 && (
                     <div className="p-8 text-center text-[#64C08E] font-bold text-sm">No recent bookings</div>
                  )}
               </div>
            </div>
          </Card>


          {/* Recent Registrations */}
          <Card className="bg-white border-[#D5EEDD] rounded-2xl shadow-sm overflow-hidden flex flex-col md:col-span-2 lg:col-span-1">
            <div className="p-6 border-b border-[#EAFBF0] flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-[#1F4131]">Recent Registrations</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/users")}
                className="text-[#34A46B] hover:text-[#1F4131] hover:bg-[#EAFBF0] font-bold rounded-lg"
              >
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-x-auto flex-1">
               <div className="grid grid-cols-12 gap-4 bg-gradient-to-r from-[#B9EBD1] to-[#D5F2D9] p-3 text-[10px] font-bold text-[#1A4F35] tracking-widest uppercase">
                  <div className="col-span-5 pl-4">Name</div>
                  <div className="col-span-4">Email</div>
                  <div className="col-span-3">Registered</div>
               </div>
               <div className="divide-y divide-[#E6F5EB]">
                  {recentRegistrations.map((item) => (
                     <div key={item.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-[#F6FDF8] transition-colors">
                        <div className="col-span-5 pl-4 font-medium text-[#2A4939] text-sm truncate pr-2" title={item.name}>{item.name}</div>
                        <div className="col-span-4 text-xs text-[#64C08E] font-medium truncate pr-2" title={item.email}>{item.email}</div>
                        <div className="col-span-3">
                           <div className="font-medium text-[#2A4939] text-xs">{new Date(item.createdAt).toLocaleDateString()}</div>
                           <div className="text-[10px] text-gray-500 font-semibold">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                     </div>
                  ))}
                  {recentRegistrations.length === 0 && (
                     <div className="p-8 text-center text-[#64C08E] font-bold text-sm">No recent registrations</div>
                  )}
               </div>
            </div>
          </Card>
          
          {/* Landing Page Updates Section */}
          <Card className="bg-gradient-to-r from-[#EAFBF0] to-[#D5F2D9] border-[#BDE8CE] shadow-sm rounded-2xl flex items-center h-full">
            <div className="p-6 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#1F4131] mb-2">Landing Page Updates</h2>
                  <p className="text-[#329D66] text-sm font-medium">
                    Easily update images and information for "What is Nirvaha" and "Explore Our Learning" sections
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/admin/content-update")}
                  className="bg-[#4EAA77] hover:bg-[#3C9162] text-white rounded-xl px-6 py-2.5 h-auto font-bold shadow-md shrink-0 ml-4"
                >
                  Manage Content
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


