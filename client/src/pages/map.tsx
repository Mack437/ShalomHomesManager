import { PropertyMap } from "@/components/map/PropertyMap";
import { useQuery } from "@tanstack/react-query";
import { MapLocation } from "@/lib/types";

export default function MapView() {
  const { data: locations, isLoading } = useQuery<MapLocation[]>({ 
    queryKey: ['/api/properties/locations'],
  });

  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Property Map</h1>
        <p className="mt-2 text-sm text-gray-500">View all properties on an interactive map</p>
        
        {/* Map Container */}
        <PropertyMap />
      </div>
    </div>
  );
}
