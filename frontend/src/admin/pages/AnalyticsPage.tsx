import React, { useState, useEffect } from "react";
import BACKEND_CONFIG from "@/config/backend";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, FileText, FileDown } from "lucide-react";

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalUsers: "0",
    activeSessions: "0",
    totalBookings: "0",
    revenue: "₹0",
  });

  const apiBaseUrl = BACKEND_CONFIG.API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, bookingsRes, usersRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/admin/stats`),
          fetch(`${apiBaseUrl}/api/bookings`),
          fetch(`${apiBaseUrl}/api/users?limit=0`),
        ]);

        const stats = await statsRes.json().catch(() => ({}));
        const bookings = await bookingsRes.json().catch(() => []);
        const users = await usersRes.json().catch(() => []);

        // Parse Data
        const normalizedBookings = Array.isArray(bookings) ? bookings : [];
        const normalizedUsers = Array.isArray(users) ? users : [];

        // Key Metrics
        const activeSessionsCount = normalizedBookings.filter(
          (b: any) => ["in-progress", "In Progress", "in progress", "upcoming", "pending"].includes(b.status)
        ).length;

        setMetrics({
          totalUsers: stats.totalUsers?.toString() || normalizedUsers.length.toString(),
          activeSessions: activeSessionsCount.toString(),
          totalBookings: stats.totalBookings?.toString() || normalizedBookings.length.toString(),
          revenue: `₹${stats.revenue || 0}`,
        });

        // User Growth Data (Cumulative by Date)
        const userCountsByDate: Record<string, number> = {};
        normalizedUsers.forEach((u: any) => {
          const dateStr = new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          userCountsByDate[dateStr] = (userCountsByDate[dateStr] || 0) + 1;
        });
        
        let cumulative = 0;
        const sortedDates = Object.keys(userCountsByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const growth = sortedDates.map(date => {
          cumulative += userCountsByDate[date];
          return { date, users: cumulative };
        });
        
        if (growth.length === 0) {
          growth.push({ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), users: 0 });
        }
        setUserGrowthData(growth);

        // Bookings Per Day
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const bookingCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        normalizedBookings.forEach((b: any) => {
          const d = new Date(b.date || b.createdAt || Date.now());
          const dayName = days[d.getDay()] as keyof typeof bookingCounts;
          if (bookingCounts[dayName] !== undefined) {
            bookingCounts[dayName]++;
          }
        });
        
        const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setBookingsData(orderedDays.map(day => ({ day, bookings: bookingCounts[day as keyof typeof bookingCounts] })));

        // Revenue Breakdown
        const revenueMap: Record<string, number> = {
          "Chat Sessions": 0,
          "Video Sessions": 0,
          "Products": 0,
          "Courses": 0,
        };
        
        normalizedBookings.forEach((b: any) => {
          const price = Number(b.price || 0);
          if (b.type === "chat") revenueMap["Chat Sessions"] += price;
          else if (b.type === "video") revenueMap["Video Sessions"] += price;
          else if (b.type === "product") revenueMap["Products"] += price;
          else if (b.type === "retreat" || b.type === "course") revenueMap["Courses"] += price;
          else revenueMap["Chat Sessions"] += price; // fallback
        });

        const revData = [
          { name: "Chat Sessions", value: revenueMap["Chat Sessions"], color: "#10b981" },
          { name: "Video Sessions", value: revenueMap["Video Sessions"], color: "#14b8a6" },
          { name: "Products", value: revenueMap["Products"], color: "#06b6d4" },
          { name: "Courses", value: revenueMap["Courses"], color: "#3b82f6" },
        ];
        
        setRevenueData(revData.filter(item => item.value > 0).length > 0 ? revData : [
          { name: "No Data", value: 1, color: "#cbd5e1" }
        ]);

      } catch (err) {
        console.error("Failed to load analytics data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl, dateRange]);

  const COLORS = ["#10b981", "#14b8a6", "#06b6d4", "#3b82f6"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Analytics & Insights</h1>
          <p className="text-gray-700">Track platform performance and user engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-white border-emerald-200 text-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="bg-white border-emerald-200 text-black hover:bg-emerald-50"
          >
            <Download className="mr-2 w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            className="bg-white border-emerald-200 text-black hover:bg-emerald-50"
          >
            <FileText className="mr-2 w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Line Chart */}
        <Card className="bg-white border-emerald-200 p-6">
          <h2 className="text-xl font-bold text-black mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#10b98140" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #10b981",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                strokeWidth={2}
                name="Total Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Bookings Per Day Bar Chart */}
        <Card className="bg-white border-emerald-200 p-6">
          <h2 className="text-xl font-bold text-black mb-4">Bookings Per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#10b98140" />
              <XAxis
                dataKey="day"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #10b981",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Bar dataKey="bookings" fill="#14b8a6" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Breakdown Pie Chart */}
        <Card className="bg-white border-emerald-200 p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-black mb-4">Revenue Breakdown</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #10b981",
                    borderRadius: "4px",
                  }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 flex flex-col justify-center">
              {revenueData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-black font-medium">{item.name}</span>
                  </div>
                  <span className="text-black font-bold">
                    ₹{item.value.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-black font-bold text-lg">Total Revenue</span>
                  <span className="text-emerald-600 font-bold text-xl">
                    ₹{revenueData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: metrics.totalUsers, change: "+0%" },
          { label: "Active Sessions", value: metrics.activeSessions, change: "+0%" },
          { label: "Total Bookings", value: metrics.totalBookings, change: "+0%" },
          { label: "Revenue (MTD)", value: metrics.revenue, change: "+0%" },
        ].map((metric, index) => (
          <Card
            key={index}
            className="bg-white border-emerald-200 p-6"
          >
            <p className="text-gray-700 text-sm mb-2">{metric.label}</p>
            <p className="text-black text-2xl font-bold mb-1">
              {loading ? "..." : metric.value}
            </p>
            <p className="text-emerald-600 text-sm font-semibold">{metric.change}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}


