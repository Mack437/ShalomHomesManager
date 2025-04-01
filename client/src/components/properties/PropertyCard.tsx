import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types";
import { MapPin } from "lucide-react";
import { Link } from "wouter";

interface PropertyCardProps {
  property: {
    id: number;
    name: string;
    location: string;
    price: number;
    beds: number;
    baths: number;
    size: number;
    imageUrl: string;
    status: "occupied" | "vacant" | "maintenance";
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "vacant":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "";
    }
  };

  return (
    <Card className="property-card bg-white shadow rounded-lg overflow-hidden transition duration-150 ease-in-out hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 w-full">
        <img 
          className="h-full w-full object-cover" 
          src={property.imageUrl} 
          alt={`${property.name} exterior`} 
        />
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <Badge className={getStatusColor(property.status)} variant="outline">
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
        <p className="mt-1 text-sm text-gray-500 flex items-center">
          <MapPin className="mr-1 h-4 w-4" /> {property.location}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">${property.price.toLocaleString()}/month</p>
            <p className="text-sm text-gray-500">
              {property.beds} bed • {property.baths} bath • {property.size}m²
            </p>
          </div>
          <div>
            <Link href={`/properties/${property.id}`}>
              <Button variant="link" className="text-primary hover:text-blue-700 text-sm font-medium">
                View details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
