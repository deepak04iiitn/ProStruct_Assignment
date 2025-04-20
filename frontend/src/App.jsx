import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactsMap from './components/ContactsMap';
import Filters from './components/Filters';
import { geocodeAddress } from './utils/geocoding';

function App() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');

  // Available project roles
  const projectRoles = [
    'Contractor',
    'Home Owner',
    'Affiliate',
    'Referral Partner',
    'Community Partner',
    'Geo Tech'
  ];

  // Fetch contacts from your backend proxy
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching contacts from HubSpot API via backend proxy...');
        
        // Use your backend proxy endpoint
        const response = await axios.get('http://localhost:3000/api/hubspot/contacts');
        
        console.log('HubSpot API response:', response);
        
        if (!response.data || !response.data.results) {
          throw new Error('Invalid response format from HubSpot API');
        }
        
        // Process HubSpot contacts
        const hubspotContacts = response.data.results.map(contact => {
          const properties = contact.properties;
          
          // Check if project_role property exists in HubSpot
          let contactRoles = [];
          if (properties.project_role) {
            contactRoles = properties.project_role.split(',').map(role => role.trim());
          } else {
            const randomRoleIndex = Math.floor(Math.random() * projectRoles.length);
            contactRoles = [projectRoles[randomRoleIndex]];
          }
            
          const name = `${properties.firstname || ''} ${properties.lastname || ''}`.trim();
          const address = properties.address || '';
          
          return {
            id: contact.id,
            name: name || 'Unknown',
            email: properties.email || '',
            phone: properties.phone || '',
            address: address,
            projectRoles: contactRoles
          };
        });
        
        // Process contacts to add coordinates
        const contactsWithCoordinates = [];
        
        for (let i = 0; i < hubspotContacts.length; i++) {
          const contact = hubspotContacts[i];
          try {
            let coordinates;
            if (contact.address) {
              coordinates = await geocodeAddress(contact.address);
            } else {
              coordinates = {
                lat: 37 + (Math.random() * 10 - 5),
                lng: -95 + (Math.random() * 10 - 5)
              };
            }
            
            contactsWithCoordinates.push({
              ...contact,
              coordinates
            });
            
            // Update state progressively
            if (i % 5 === 0 || i === hubspotContacts.length - 1) {
              setContacts([...contactsWithCoordinates]);
              setFilteredContacts([...contactsWithCoordinates]);
            }
          } catch (error) {
            console.error(`Failed to geocode address for ${contact.name}:`, error);
            contactsWithCoordinates.push({
              ...contact,
              coordinates: {
                lat: 37 + (Math.random() * 10 - 5),
                lng: -95 + (Math.random() * 10 - 5)
              }
            });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
          
          if (error.response.status === 401) {
            setError('Authentication failed. Check your HubSpot token.');
          } else {
            setError(`Failed to load contacts: Status ${error.response.status}`);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('No response received from API. Check your network connection.');
        } else {
          console.error('Error message:', error.message);
          setError(`Error: ${error.message}`);
        }
        
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    filterContacts();
  }, [selectedRoles, locationFilter, contacts]);

  // Filter contacts based on selected roles and location
  const filterContacts = () => {
    let filtered = [...contacts];
    
    // Filter by roles if any are selected
    if (selectedRoles.length > 0) {
      filtered = filtered.filter(contact => 
        contact.projectRoles && contact.projectRoles.some(role => selectedRoles.includes(role))
      );
    }
    
    // Filter by location if entered
    if (locationFilter.trim()) {
      const locationLower = locationFilter.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.address && contact.address.toLowerCase().includes(locationLower)
      );
    }
    
    setFilteredContacts(filtered);
  };

  // Handle role selection changes
  const handleRoleChange = (role) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  // Handle location filter changes
  const handleLocationChange = (event) => {
    setLocationFilter(event.target.value);
  };

  if (loading && contacts.length === 0) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-lg">Loading contacts from HubSpot...</div>
    </div>
  );
  
  if (error && contacts.length === 0) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-lg text-red-500">{error}</div>
      <div className="mt-2">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white px-4 py-4">
        <h1 className="text-2xl font-bold">ProStruct Engineering Contacts</h1>
        <p className="text-sm opacity-80">
          {loading && contacts.length > 0 ? 'Loading contacts...' : `Showing ${filteredContacts.length} of ${contacts.length} contacts`}
        </p>
        {error && <p className="text-xs text-red-200 mt-1">{error}</p>}
      </header>
      
      <Filters 
        projectRoles={projectRoles}
        selectedRoles={selectedRoles}
        locationFilter={locationFilter}
        onRoleChange={handleRoleChange}
        onLocationChange={handleLocationChange}
      />
      
      <div className="flex-1 relative">
        {contacts.length > 0 && (
          <ContactsMap 
            contacts={filteredContacts} 
            projectRoles={projectRoles}
          />
        )}
      </div>
    </div>
  );
}

export default App;