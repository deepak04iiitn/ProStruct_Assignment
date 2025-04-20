/**
 * Geocodes an address string to latitude and longitude coordinates using Nominatim
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number}>} Object containing latitude and longitude
 */
export const geocodeAddress = async (address) => {
  try {
    // Use Nominatim (OpenStreetMap) which doesn't require an API key
    // Note: For production use, please respect Nominatim usage policy by:
    // 1. Adding a short delay between requests
    // 2. Setting a proper User-Agent header
    // 3. Caching results
    
    // Add a delay to respect usage policy
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      {
        headers: {
          // Set a meaningful User-Agent as per Nominatim usage policy
          'User-Agent': 'ProStructEngineeringApp/1.0'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error);
    // Return default coordinates (US center) if geocoding fails
    return { lat: 39.8283, lng: -98.5795 };
  }
};