const axios = require('axios');
const fs = require('fs');

// Read a test image
const imageBuffer = fs.readFileSync('test.jpg');
const imageBase64 = imageBuffer.toString('base64');

axios.post('https://your-vercel-url/api/plantnet', {
  imageBase64,
  organ: 'leaf'
})
.then(response => {
  console.log('Success:', response.data);
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
}); 
