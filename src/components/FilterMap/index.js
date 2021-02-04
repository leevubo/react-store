import React, {useState, useEffect} from "react";
import GoogleMapReact from 'google-map-react';
import Marker from '../Marker';

const FilterMap = (props: any) => {
   
  const getMapOptions = (maps: any) => {
    return {
      disableDefaultUI: true,
      mapTypeControl: true,
      streetViewControl: true,
      styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'on' }] }],
    };
  };
  const [center, setCenter] = useState({lat: 30.571905, lng: -96.298820 });
  const [zoom, setZoom] = useState(8);
  const [data, setData]=useState([]);
  const [loadedMap, setLoadedMap] = useState(null);
  const [loadedMaps, setLoadedMaps] = useState(null);

  useEffect(()=>{
    setData(props.data);
    if(loadedMap !== null && loadedMaps !== null){
      const bounds = getMapBounds(loadedMap, loadedMaps, data);
      // Fit map to bounds
      loadedMap.fitBounds(bounds);
      // Bind the resize listener
      bindResizeListener(loadedMap, loadedMaps, bounds);
    }
    
  },[props.data, props.searchValue])

 
  // Re-center map when resizing the window
  const bindResizeListener = (map, maps, bounds) => {
    
    maps.event.addDomListenerOnce(map, 'idle', () => {
      maps.event.addDomListener(window, 'resize', () => {
        map.fitBounds(bounds);
      });
    });
  };

  // Return map bounds based on list of places
  const getMapBounds = (map, maps, places) => {
    const bounds = new maps.LatLngBounds();

    places.forEach((place) => {
      bounds.extend(new maps.LatLng(
        place.latitude,
        place.longitude,
      ));
    });
    return bounds;
  };

  // Fit map to its bounds after the api is loaded
  const apiIsLoaded = (map, maps, places) => {
    console.log(' -------- api loaded ---------')
    console.log(map, maps)
    setLoadedMap(map);
    setLoadedMaps(maps);
    // Get bounds by our places
    const bounds = getMapBounds(map, maps, places);
    // Fit map to bounds
    map.fitBounds(bounds);
    // Bind the resize listener
    bindResizeListener(map, maps, bounds);
  };
  
   
  return (
      <div style={{ height: '50vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
        defaultCenter={center}
        defaultZoom={zoom}
        options={getMapOptions}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, data)}
      >
        {
          data && data.length>0 && data.map((item) => 
            <Marker 
              name={item.dealer_name} 
              id={item.dealer_id}  
              type={item.dealer_type} 
              showDealer={props.showDealer} 
              showSpringFree={props.showSpringFree}
              lat={item.latitude} 
              lng={item.longitude} 
              key={item.dealer_id} 
            />
          )
        }
      </GoogleMapReact>
    </div>
  );
}

export default FilterMap;