import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/lib/types";
import { Building, User, Clock } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  activity: {
    title: string;
    status: "pending" | "completed";
    property: string;
    user: string;
    time: string;
  }
}

function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-primary truncate">
            {activity.title}
          </p>
          <div className="ml-2 flex-shrink-0 flex">
            <Badge
              variant={activity.status === "pending" ? "outline" : "default"}
              className={activity.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : "bg-green-100 text-green-800 hover:bg-green-100"}
            >
              {activity.status === "pending" ? "Pending" : "Completed"}
            </Badge>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            <p className="flex items-center text-sm text-gray-500">
              <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {activity.property}
            </p>
            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
              <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {activity.user}
            </p>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <p>
              {activity.time}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export function ActivityList() {
  const { data: activities, isLoading } = useQuery({ 
    queryKey: ['/api/activities?limit=5']
  });

  // Demo activities for illustration
  const demoActivities = [
    {
      title: "New maintenance request submitted",
      status: "pending" as const,
      property: "Shalom Heights, Apt 302",
      user: "Sarah Johnson",
      time: "2 hours ago"
    },
    {
      title: "Payment received for July rent",
      status: "completed" as const,
      property: "Garden Villas, Apt 105",
      user: "Michael Brown",
      time: "Yesterday"
    },
    {
      title: "Repair completed: Leaking faucet",
      status: "completed" as const,
      property: "Shalom Towers, Apt 501",
      user: "Robert Lee (Handyman)",
      time: "2 days ago"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {demoActivities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
