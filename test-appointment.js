const axios = require('axios');

// Test the appointment creation endpoint with the same data from the error
const testData = {
  clientId: 'f7279794-86d9-4ae1-a600-9e21cf8ed07f',
  userId: '2d4abe31-6ac8-4390-9a73-7d95430fd3c2',
  date: '2025-07-22',
  startTime: '2025-07-22T10:00:00',
  procedureIds: ['test-procedure-id'], // This needs to be a real procedure ID
};

async function testAppointment() {
  try {
    const response = await axios.post('http://localhost:3009/api/appointments', testData, {
      headers: {
        'Content-Type': 'application/json',
        // We need a valid JWT token, but let's first see what error we get without it
      }
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
  }
}

testAppointment();