import { divIcon } from 'leaflet';
import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const icons = {
    xxSmall: divIcon({className: 'marker-icon pink', iconSize: [12, 12]}),
    xSmall: divIcon({className: 'marker-icon pink', iconSize: [16, 16]}),
    Small: divIcon({className: 'marker-icon pink', iconSize: [24, 24]}),
    normal: divIcon({className: 'marker-icon purple', iconSize: [32, 32]}),
    large: divIcon({className: 'marker-icon purple', iconSize: [48, 48]}),
    xLarge: divIcon({className: 'marker-icon red', iconSize: [72, 72]}),
    xxLarge: divIcon({className: 'marker-icon red', iconSize: [96, 96]})
}

function MapView(props) {
    const{ locationArray, mapCenter, onSelectMarker} = props;

    // Marker
    const markerElements = locationArray.map(location => {
        const{
            id, country_code,
            country, province,
            coordinates : {latitude, longitude},
            latest: {confirmed}
        } = location;

        // 1. 1-100 = pink (เล็กมากกกๆ)
        // 2. 101-500 = pink (เล็กมาก)
        // 3. 501-1000 = pink (เล็ก)
        // 4. 1001-5000 = purple (กลาง)
        // 5. 5001-10000 = purple (ใหญ่)
        // 6. 10001-50000 = red (ใหญ่มาก)
        // 7. 50000+ = red (ใหญ่มากกกๆ)
        let markerIcon = icons.xxSmall;
        if (confirmed >= 101 && confirmed <= 500) {
            markerIcon = icons.xSmall;
        }
        else if (confirmed >=501 && confirmed <= 1000) {
            markerIcon = icons.Small;
        }
        else if (confirmed >= 1001 && confirmed <= 5000) {
            markerIcon = icons.normal;
        }
        else if (confirmed >= 5001 && confirmed <= 10000) {
            markerIcon = icons.large;
        }
        else if (confirmed >= 10001 && confirmed <= 50000) {
            markerIcon = icons.xLarge;
        }
        else if (confirmed >= 50001) {
            markerIcon = icons.xxLarge;
        }

        let title = country;
        if (province !== '' && province !== country) {
            title = `${province}, ${country}`;
        }

        return(
            <Marker 
            key={`${id}-${country_code}`} 
            position={[latitude, longitude]}
            icon={markerIcon} 
            onclick={() => onSelectMarker(id)} >
            <Popup>{title}</Popup>
        </Marker>
        );
    });

    // Map
    return (
        <Map className="map-view" center={mapCenter} zoom={5}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markerElements}
        </Map>
    );
}

export default MapView;
