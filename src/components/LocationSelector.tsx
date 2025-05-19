
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface LocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
}

const LocationSelector = ({ onLocationSelect, initialLocation }: LocationSelectorProps) => {
  const [location, setLocation] = useState(initialLocation || { lat: 40.7128, lng: -74.006, address: "New York, NY" });
  const [searchAddress, setSearchAddress] = useState("");
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ lat: number; lng: number; address: string }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // This is a mock implementation. In a real app, we would use a real map API
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMapLoaded(true);
      if (initialLocation) {
        setSearchAddress(initialLocation.address);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [initialLocation]);

  const handleSearch = () => {
    if (!searchAddress.trim()) return;
    
    // Mock search results (in a real app, this would use a geocoding API)
    const mockResults = [
      { 
        lat: location.lat + (Math.random() - 0.5) * 0.01, 
        lng: location.lng + (Math.random() - 0.5) * 0.01, 
        address: searchAddress 
      },
      { 
        lat: location.lat + (Math.random() - 0.5) * 0.01, 
        lng: location.lng + (Math.random() - 0.5) * 0.01, 
        address: `${searchAddress} Building A` 
      },
      { 
        lat: location.lat + (Math.random() - 0.5) * 0.01, 
        lng: location.lng + (Math.random() - 0.5) * 0.01, 
        address: `${searchAddress} Plaza` 
      }
    ];
    
    setSearchResults(mockResults);
    setShowSearchResults(true);
  };

  const selectSearchResult = (result: { lat: number; lng: number; address: string }) => {
    setLocation(result);
    setSearchAddress(result.address);
    setShowSearchResults(false);
    setLocationConfirmed(false);
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
    setSearchAddress(newLocation.address);
    setLocationConfirmed(false);
    toast.info("Location selected. Please confirm to save.");
  };

  const confirmLocation = () => {
    onLocationSelect(location);
    setLocationConfirmed(true);
    toast.success("Location confirmed successfully!");
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
        <div className="relative mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                placeholder="Search address" 
                value={searchAddress} 
                onChange={(e) => {
                  setSearchAddress(e.target.value);
                  setLocationConfirmed(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
              {searchResults.map((result, index) => (
                <div 
                  key={index} 
                  className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  onClick={() => selectSearchResult(result)}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{result.address}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div 
          ref={mapRef}
          className="w-full h-[300px] bg-gray-100 border rounded-md relative cursor-crosshair mb-4"
          onClick={handleMapClick}
        >
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">Loading map...</div>
          ) : (
            <>
              <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                <div className="text-gray-400">Interactive Map (Click to select location)</div>
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
        
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm font-medium">Selected Location:</div>
            <div className="text-sm text-muted-foreground flex items-start mt-1">
              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </div>
          </div>
          
          <Button 
            onClick={confirmLocation} 
            disabled={locationConfirmed}
            className="w-full"
          >
            {locationConfirmed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Location Confirmed
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Confirm Location
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
