import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Role colors for markers
const roleColors = {
  'Contractor': '#3388ff',
  'Home Owner': '#33cc33',
  'Affiliate': '#ffcc00',
  'Referral Partner': '#9933cc',
  'Community Partner': '#ff9900',
  'Geo Tech': '#ff66cc'
};

// Default color
const defaultColor = '#ff0000';

function ContactsMap({ contacts, projectRoles }) {
  // Function to get marker color based on project role
  const getMarkerColor = (roles) => {
    if (!roles || roles.length === 0) return defaultColor;
    // If multiple roles, use the first one
    const role = roles[0];
    return roleColors[role] || defaultColor;
  };
  
  // Center of USA as default view
  const defaultCenter = [39.8283, -98.5795];
  const defaultZoom = 4;

  // Create custom icon for each contact based on their role
  const createIcon = (roles) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${getMarkerColor(roles)}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // Role badge component
  const RoleBadge = ({ role }) => (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
      {role}
    </span>
  );

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {contacts.map(contact => (
          <Marker
            key={contact.id}
            position={[contact.coordinates.lat, contact.coordinates.lng]}
            icon={createIcon(contact.projectRoles)}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <h3 className="font-bold text-lg">{contact.name}</h3>
                
                <div className="mt-2">
                  {contact.projectRoles.map(role => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
                
                {contact.email && (
                  <p className="mt-2">
                    <strong>Email:</strong> {contact.email}
                  </p>
                )}
                
                {contact.phone && (
                  <p className="mt-1">
                    <strong>Phone:</strong> {contact.phone}
                  </p>
                )}
                
                {contact.address && (
                  <p className="mt-1">
                    <strong>Address:</strong> {contact.address}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ContactsMap;