// server.js (Node.js + Express)
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your React app's origin
app.use(cors({
  origin: 'http://localhost:5173' // Your React app's URL
}));

// HubSpot API proxy endpoint
app.get('/api/hubspot/contacts', async (req, res) => {
  try {
    const TOKEN = process.env.HUBSPOT_TOKEN; // Store token in environment variable
    
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
    
    if (error.response) {
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
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

