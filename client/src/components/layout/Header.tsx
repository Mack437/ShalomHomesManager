import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";

export function Header() {
  return (
    <div className="hidden lg:flex sticky top-0 z-10 flex-shrink-0 h-16 bg-white shadow">
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-2xl">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input 
                id="search" 
                name="search" 
                className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                placeholder="Search for properties, tasks, users..." 
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <Button variant="ghost" size="icon" className="relative rounded-full text-gray-400 hover:text-gray-500">
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs text-white justify-center items-center">3</span>
            </span>
            <Bell className="h-5 w-5" />
            <span className="sr-only">View notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="ml-3 rounded-full text-gray-400 hover:text-gray-500">
            <Settings className="h-5 w-5" />
            <span className="sr-only">View settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
