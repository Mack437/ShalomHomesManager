import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "./PropertyCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Property } from "@/lib/types";

// Sample properties data
const sampleProperties = [
  {
    id: 1,
    name: "Shalom Heights, Apt 302",
    location: "Jerusalem, Central District",
    price: 1200,
    beds: 2,
    baths: 1,
    size: 75,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    status: "occupied" as const
  },
  {
    id: 2,
    name: "Garden Villas, Apt 105",
    location: "Tel Aviv, Central District",
    price: 1450,
    beds: 3,
    baths: 2,
    size: 95,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    status: "maintenance" as const
  },
  {
    id: 3,
    name: "Shalom Towers, Apt 501",
    location: "Haifa, Northern District",
    price: 980,
    beds: 1,
    baths: 1,
    size: 55,
    imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    status: "vacant" as const
  }
];

export function PropertyGrid() {
  const [propertyType, setPropertyType] = useState("all");
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: properties, isLoading } = useQuery({ 
    queryKey: ['/api/properties'],
  });

  // Use sample data for now
  const filteredProperties = sampleProperties.filter(property => {
    if (propertyType !== "all" && property.name.toLowerCase().includes(propertyType.toLowerCase())) {
      return false;
    }
    if (location !== "all" && !property.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    if (status !== "all" && property.status !== status) {
      return false;
    }
    if (searchTerm && !property.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !property.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="mt-2 sm:mt-0">
            <Select defaultValue="all" onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="apartments">Apartments</SelectItem>
                <SelectItem value="houses">Houses</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 sm:mt-0">
            <Select defaultValue="all" onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="jerusalem">Jerusalem</SelectItem>
                <SelectItem value="tel aviv">Tel Aviv</SelectItem>
                <SelectItem value="haifa">Haifa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 sm:mt-0">
            <Select defaultValue="all" onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative rounded-md shadow-sm w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input 
              type="text" 
              className="pl-10" 
              placeholder="Search properties..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Property Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
