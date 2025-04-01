import { Link, useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Building, 
  CheckSquare, 
  CreditCard, 
  Users, 
  MapPin, 
  LogOut,
  FormInput
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-3 text-gray-300" size={20} /> },
    { href: "/properties", label: "Properties", icon: <Building className="mr-3 text-gray-300" size={20} /> },
    { href: "/tasks", label: "Tasks", icon: <CheckSquare className="mr-3 text-gray-300" size={20} /> },
    { href: "/pos", label: "POS System", icon: <CreditCard className="mr-3 text-gray-300" size={20} /> },
    { href: "/users", label: "Users", icon: <Users className="mr-3 text-gray-300" size={20} /> },
    { href: "/map", label: "Map View", icon: <MapPin className="mr-3 text-gray-300" size={20} /> },
    { href: "/form-demo", label: "Form Demo", icon: <FormInput className="mr-3 text-gray-300" size={20} /> },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-800">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
          <Logo className="h-8 w-8 text-white" />
          <span className="ml-2 text-xl font-bold text-white">ShalomHomes</span>
        </div>
        
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                <p className="text-xs font-medium text-gray-300">{user?.role || "User"}</p>
              </div>
              <button 
                onClick={() => logout()} 
                className="ml-auto text-gray-400 hover:text-white"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
