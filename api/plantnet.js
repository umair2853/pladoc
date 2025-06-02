const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

module.exports = async (req, res) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  try {
    const { imageBase64, organ } = req.body;
    
    // Validate input
    if (!imageBase64 || !organ) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(imageBase64, 'base64');
    
    // Create form data for PlantNet
    const form = new FormData();
    form.append('images', buffer, { filename: 'plant.jpg' });
    form.append('organs', organ);

    // Forward request to PlantNet
    const response = await axios.post(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_API_KEY}`,
      form,
      {
        headers: form.getHeaders()
      }
    );

    // Set CORS headers for actual response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Return PlantNet response to client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Set CORS headers for error response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(500).json({
      error: 'Plant identification failed',
      details: error.response?.data || error.message
    });
  }
}; 
