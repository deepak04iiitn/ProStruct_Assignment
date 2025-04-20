import axios from 'axios';

export const getContacts = async (req, res) => {

  try {
    const TOKEN = process.env.HUBSPOT_TOKEN;
    
    const response = await axios({
      method: 'get',
      url: 'https://api.hubapi.com/crm/v3/objects/contacts',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      params: {
        properties: 'firstname,lastname,email,phone,address,project_role',
        limit: 100
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request to HubSpot:', error);
    
    if(error.response) {
      res.status(error.response.status).json({
        error: `HubSpot API error: ${error.response.status}`,
        message: error.response.data
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
};