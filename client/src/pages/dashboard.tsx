import { useQuery } from "@tanstack/react-query";
import { Building, CheckSquare, CreditCard } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { DashboardStats } from "@/lib/types";

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({ 
    queryKey: ['/api/dashboard/stats'],
    // Fallback for demo purposes
    initialData: {
      totalProperties: 24,
      activeListings: 9,
      openTasks: 12,
      highPriorityTasks: 4,
      monthlyRevenue: 24560,
      monthName: "July",
      revenueGrowth: 8
    }
  });

  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Stats overview */}
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard
            title="Total Properties"
            value={stats?.totalProperties || 0}
            icon={<Building size={24} />}
            footerText={`${stats?.activeListings || 0} active listings`}
            trend={{ value: 5, positive: true }}
          />
          
          <StatCard
            title="Open Tasks"
            value={stats?.openTasks || 0}
            icon={<CheckSquare size={24} />}
            footerText={`${stats?.highPriorityTasks || 0} high priority`}
            trend={{ value: 12, positive: false }}
          />
          
          <StatCard
            title="Monthly Revenue"
            value={`$${stats?.monthlyRevenue.toLocaleString() || "0"}`}
            icon={<CreditCard size={24} />}
            footerText={stats?.monthName || ""}
            trend={{ value: stats?.revenueGrowth || 0, positive: true }}
          />
        </dl>

        {/* Recent Activity */}
        <h2 className="mt-8 text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4">
          <ActivityList />
        </div>
      </div>
    </div>
  );
}
