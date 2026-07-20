const https = require('https');

const options = {
  hostname: 'jobpilot-backend-l4o2.onrender.com',
  port: 443,
  path: '/api/v1/applications/automate',
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://job-pilot-ai-priyatam-ux.vercel.app',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type'
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', res.headers);
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
