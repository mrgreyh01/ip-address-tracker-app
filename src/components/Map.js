"use client"
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useState, useRef } from "react";

export default function MapComponent ({lat, lon, location}) {

    const [loaded, setLoaded] = useState(false);

    const mapRef = useRef(null);

    useEffect(() => {

    if (lat === undefined || lon === undefined || lat === null || lon === null) {
      return; 
    }

    if (mapRef.current) {

      const map = mapRef.current.getMap();
   
      if (map && map.loaded()) {
        mapRef.current.flyTo({
          center: [lon, lat],
          zoom: 14,
          duration: 2000, 
        });
      } else {

        map.once('load', () => {
          mapRef.current.flyTo({
            center: [lon, lat],
            zoom: 14,
            duration: 2000, 
          });
        });
      }
    }
  }, [lat, lon]);

    if (!lat || !lon) {
        return <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />;
    }

    return( 

        <Map
        ref={mapRef}
        initialViewState={{
            longitude: lon,
            latitude: lat,
            zoom: 12
        }}
        style={{width: "100%", height: "100%"}}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=uIjrm9hiN170STx3NmNK"
        onLoad={() => setLoaded(true)}
        >

          {lat && lon && location && (
            <Popup 
              longitude={lon} 
              latitude={lat} 
              anchor="top"      
              closeButton={false} 
              closeOnClick={true} 
              pitchAlignment="auto"
              borderRadius="50px"
            >
              <div className="bg-white font-rubik font-bold text-slate-800 text-xs px-2 py-1">
                {location}
              </div>
            </Popup>
          )}
          
          {lat && lon && loaded && (
              <Marker longitude={lon} latitude={lat} anchor="bottom" pitchAlignment="auto" color="black" />
          )}

          <NavigationControl position="bottom-right" />
        </Map>

    );      
}