
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface LocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
}

const LocationSelector = ({ onLocationSelect, initialLocation }: LocationSelectorProps) => {
  const [location, setLocation] = useState(initialLocation || { lat: 40.7128, lng: -74.006, address: "" });
  const [searchAddress, setSearchAddress] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // This is a mock implementation. In a real app, we would use a real map API
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleSearch = () => {
    if (!searchAddress.trim()) return;
    
    // This is a mock geocoding. In a real app, we would use a geocoding API
    const mockGeocode = () => {
      // Simulate a random location near the initial point
      const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
      const lng = -74.006 + (Math.random() - 0.5) * 0.1;
      
      setLocation({ lat, lng, address: searchAddress });
      onLocationSelect({ lat, lng, address: searchAddress });
      toast.success("Location updated");
    };
    
    mockGeocode();
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapLoaded) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click coordinates to "geo" coordinates (mock implementation)
    const lat = 40.7128 + ((y - 150) / 300) * 0.1;
    const lng = -74.006 + ((x - 200) / 400) * 0.1;
    
    const newLocation = { 
      lat, 
      lng, 
      address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}` 
    };
    
    setLocation(newLocation);
    onLocationSelect(newLocation);
    setSearchAddress(newLocation.address);
    toast.success("Location selected");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Select Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Search address" 
            value={searchAddress} 
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        
        <div 
          ref={mapRef}
          className="w-full h-[300px] bg-gray-100 border rounded-md relative cursor-crosshair"
          onClick={handleMapClick}
        >
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">Loading map...</div>
          ) : (
            <>
              <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                <div className="text-gray-400">Interactive Map (Mock)</div>
              </div>
              <div 
                className="absolute w-6 h-6 bg-red-500 rounded-full -ml-3 -mt-3 border-2 border-white"
                style={{ 
                  left: `${200 + ((location.lng - -74.006) / 0.1) * 400}px`,
                  top: `${150 + ((location.lat - 40.7128) / 0.1) * 300}px` 
                }}
              ></div>
            </>
          )}
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-medium">Selected Location:</div>
          <div className="text-sm text-muted-foreground">
            {location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
