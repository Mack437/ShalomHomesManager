import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property, MapLocation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";

// For visualization purposes (until Google Maps API is integrated)
export function PropertyMap() {
  // Mock locations for the map
  const locations: MapLocation[] = [
    {
      latitude: 31.768319,
      longitude: 35.213710,
      name: "Shalom Heights",
      propertyId: 1,
      status: "active",
      details: "8 Units"
    },
    {
      latitude: 32.0853,
      longitude: 34.7818,
      name: "Garden Villas",
      propertyId: 2,
      status: "active",
      details: "12 Units"
    }
  ];

  // This would be replaced with actual Google Maps integration
  return (
    <Card className="mt-4 bg-white p-4 shadow sm:rounded-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Map Container (placeholder) */}
        <div className="map-container rounded-lg h-96 bg-gray-100 relative">
          {/* This would be replaced with the Google Maps component */}
          <div className="w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-70">
            <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Interactive Property Map</h3>
              <p className="mt-2 text-sm text-gray-500">This map would display all ShalomHomes properties with location markers and information windows.</p>
              <div className="mt-4 flex justify-center space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700">
                  View Map Legend
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Filter Properties
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property list below map */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Nearby Properties</h3>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {locations.map((location, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <Building className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{location.name}</h4>
                  <p className="text-sm text-gray-500">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100" variant="outline">
                    {location.details}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
