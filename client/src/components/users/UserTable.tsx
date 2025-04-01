import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserWithProperty, UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PencilIcon } from "lucide-react";

// Sample users
const sampleUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "Jerusalem",
    role: "client" as UserRole,
    property: "Shalom Heights, Apt 302",
    status: "active"
  },
  {
    id: 2,
    name: "Mark Wilson",
    email: "mark.wilson@example.com",
    phone: "+1 (555) 987-6543",
    location: "Tel Aviv",
    role: "caretaker" as UserRole,
    property: "Multiple Properties",
    status: "active"
  },
  {
    id: 3,
    name: "Robert Lee",
    email: "robert.lee@example.com",
    phone: "+1 (555) 456-7890",
    location: "Haifa",
    role: "handyman" as UserRole,
    property: "All Properties",
    status: "active"
  }
];

export function UserTable() {
  const [userType, setUserType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({ 
    queryKey: ['/api/users'],
  });

  // Use sample data for now
  const filteredUsers = sampleUsers.filter(user => {
    if (userType !== "all" && user.role !== userType) {
      return false;
    }
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    const roleColors = {
      client: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      owner: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      caretaker: "bg-green-100 text-green-800 hover:bg-green-100",
      contractor: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      handyman: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    };

    return (
      <Badge variant="outline" className={roleColors[role]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <div>
      {/* Filters */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center">
        <div className="flex space-x-2">
          <Button 
            variant={userType === "all" ? "default" : "ghost"} 
            className={userType === "all" ? "" : "text-gray-700 hover:bg-gray-100"}
            onClick={() => setUserType("all")}
          >
            All Users
          </Button>
          <Button 
            variant={userType === "client" ? "default" : "ghost"} 
            className={userType === "client" ? "" : "text-gray-700 hover:bg-gray-100"}
            onClick={() => setUserType("client")}
          >
            Clients
          </Button>
          <Button 
            variant={userType === "caretaker" ? "default" : "ghost"} 
            className={userType === "caretaker" ? "" : "text-gray-700 hover:bg-gray-100"}
            onClick={() => setUserType("caretaker")}
          >
            Staff
          </Button>
          <Button 
            variant={userType === "handyman" ? "default" : "ghost"} 
            className={userType === "handyman" ? "" : "text-gray-700 hover:bg-gray-100"}
            onClick={() => setUserType("handyman")}
          >
            Contractors
          </Button>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input 
              type="text" 
              className="pl-10"
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="mt-6 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phone}</div>
                        <div className="text-sm text-gray-500">{user.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.property}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="link" className="text-primary hover:text-blue-900">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
