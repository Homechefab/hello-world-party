import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ChefHat, MapPin } from 'lucide-react';

interface Chef {
  id: string;
  business_name: string;
  full_name: string;
  address: string;
  distance?: number;
  city?: string;
}

interface SearchMapProps {
  chefs: Chef[];
  searchArea?: string;
  onChefSelect?: (chef: Chef) => void;
}

const SearchMap: React.FC<SearchMapProps> = ({ chefs, searchArea, onChefSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [needsToken, setNeedsToken] = useState(false);

  // Simple coordinates for Swedish cities/areas
  const getCoordinates = (location: string): [number, number] => {
    const locations: { [key: string]: [number, number] } = {
      'stockholm': [18.0686, 59.3293],
      'södermalm': [18.0758, 59.3181],
      'gamla stan': [18.0711, 59.3251],
      'östermalm': [18.0864, 59.3364],
      'vasastan': [18.0582, 59.3467],
      'norrmalm': [18.0649, 59.3326],
      'göteborg': [11.9746, 57.7089],
      'malmö': [13.0038, 55.6050],
      'uppsala': [17.6389, 59.8586],
      'linköping': [15.6214, 58.4108],
      'örebro': [15.2134, 59.2753]
    };

    const normalized = location.toLowerCase().trim();
    
    // Try exact match first
    if (locations[normalized]) {
      return locations[normalized];
    }
    
    // Try partial match
    for (const [key, coords] of Object.entries(locations)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return coords;
      }
    }
    
    // Default to Stockholm
    return locations['stockholm'];
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;
    
    // Determine center based on search area or chefs
    let center: [number, number] = [18.0686, 59.3293]; // Default to Stockholm
    let zoom = 10;

    if (searchArea) {
      center = getCoordinates(searchArea);
      zoom = 11;
    } else if (chefs.length > 0) {
      // Calculate bounds based on chef locations
      const coords = chefs.map(chef => getCoordinates(chef.address || chef.city || 'stockholm'));
      if (coords.length > 0) {
        const lngs = coords.map(c => c[0]);
        const lats = coords.map(c => c[1]);
        const avgLng = lngs.reduce((a, b) => a + b) / lngs.length;
        const avgLat = lats.reduce((a, b) => a + b) / lats.length;
        center = [avgLng, avgLat];
      }
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for chefs
    chefs.forEach((chef, index) => {
      const coords = getCoordinates(chef.address || chef.city || 'stockholm');
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'chef-marker';
      el.style.cssText = `
        background-color: hsl(var(--primary));
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      `;
      
      const icon = document.createElement('div');
      icon.innerHTML = '👨‍🍳';
      icon.style.fontSize = '16px';
      el.appendChild(icon);

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      el.addEventListener('click', () => {
        if (onChefSelect) {
          onChefSelect(chef);
        }
      });

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-sm mb-1">${chef.business_name}</h3>
          <p class="text-xs text-gray-600 mb-2">${chef.full_name}</p>
          <div class="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <span>📍</span>
            <span>${chef.city || chef.address}</span>
          </div>
          ${chef.distance ? `
            <div class="flex items-center gap-1 text-xs text-gray-500">
              <span>📏</span>
              <span>${chef.distance} km bort</span>
            </div>
          ` : ''}
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Fit bounds if multiple chefs
    if (chefs.length > 1) {
      const coords = chefs.map(chef => getCoordinates(chef.address || chef.city || 'stockholm'));
      const bounds = new mapboxgl.LngLatBounds();
      coords.forEach(coord => bounds.extend(coord));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  useEffect(() => {
    // Check if we have a Mapbox token from Supabase secrets
    const checkMapboxToken = async () => {
      try {
        // Try to get token from environment or Supabase
        const token = process.env.MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTNmc2g4YW4xNHgyMnFzOWF6azk4aDd1In0.PmVxsAUjcgv5tUs-SKdq0g';
        
        if (token && token.startsWith('pk.')) {
          setMapboxToken(token);
          initializeMap(token);
        } else {
          setNeedsToken(true);
        }
      } catch (error) {
        setNeedsToken(true);
      }
    };

    checkMapboxToken();
  }, [chefs, searchArea]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const token = formData.get('token') as string;
    
    if (token && token.startsWith('pk.')) {
      setMapboxToken(token);
      setNeedsToken(false);
      initializeMap(token);
    } else {
      alert('Ogiltig Mapbox token. Den ska börja med "pk."');
    }
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  if (needsToken) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="text-center space-y-4">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-semibold">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground">
            För att visa kartan behöver vi din Mapbox public token. 
            Gå till <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a> för att få din token.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-3">
            <input
              type="text"
              name="token"
              placeholder="Klistra in din Mapbox public token här..."
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
            >
              Aktivera karta
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      {chefs.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg">
          <div className="text-center">
            <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Inga kockar att visa på kartan</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMap;