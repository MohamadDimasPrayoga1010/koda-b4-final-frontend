import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link as LinkIcon, Eye, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api"; 

export default function Dashboard() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!accessToken) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/dashboard/stats", {}, accessToken);
        const statData = data?.data || {};

        console.log("Stat Data:", statData);
        console.log("API Response:", data);
        setStats([
          {
            icon: <LinkIcon className="w-5 h-5" />,
            label: "Total Links",
            value: statData.totalLinks,
            change: "",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
          },
          {
            icon: <Eye className="w-5 h-5" />,
            label: "Total Visits",
            value: statData.totalVisits,
            change: "",
            iconBg: "bg-purple-50",
            iconColor: "text-purple-500",
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            label: "Avg. Click Rate",
            value: (statData.avgClickRate ?? 0).toFixed(2),
            change: "",
            iconBg: "bg-green-50",
            iconColor: "text-green-500",
          },
        ]);
        console.log("last7Days:", statData.last7Days);
        setChartData(
          (statData.last7Days || []).map((item) => ({
            date: item.date,
            visits: item.visits,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [accessToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log("cona");
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back! Here's your link performance overview.
            </p>
          </div>
          <Link
            to={"/"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            Create Short Link
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-lg`}
                >
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-green-600 text-sm">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Visitor Analytics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
